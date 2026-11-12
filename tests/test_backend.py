import os
import sqlite3
import tempfile
import unittest
from datetime import date
from pathlib import Path
from types import SimpleNamespace

_test_database_directory = tempfile.TemporaryDirectory(prefix="portfolio-tests-")
os.environ["CONTACTS_DB_PATH"] = str(
    Path(_test_database_directory.name) / "contacts.sqlite3"
)

from backend import analytics, database, project_catalog
import backend.app as backend_app
from backend.app import contact_limiter
from backend.rate_limit import SlidingWindowRateLimiter
from backend.security import is_admin_authorized
from backend.validators import normalize_contact_payload


class ContactValidationTests(unittest.TestCase):
    def test_normalizes_and_accepts_valid_contact(self):
        result, errors = normalize_contact_payload({
            "name": "  Alex Example \n",
            "email": " alex@example.com ",
            "subject": " \n ",
            "message": " Hello there \r\n",
        })

        self.assertEqual(errors, {})
        self.assertEqual(result, {
            "name": "Alex Example",
            "email": "alex@example.com",
            "subject": "Portfolio Inquiry",
            "message": "Hello there",
        })

    def test_rejects_non_object_and_invalid_fields(self):
        normalized, errors = normalize_contact_payload(["not", "an", "object"])
        self.assertEqual(normalized, {})
        self.assertIn("payload", errors)

        normalized, errors = normalize_contact_payload({
            "name": "A",
            "email": "not-an-email",
            "message": "No",
        })
        self.assertEqual(set(errors), {"name", "email", "message"})
        self.assertEqual(normalized["subject"], "Portfolio Inquiry")

    def test_reports_oversized_fields_instead_of_silently_truncating(self):
        normalized, errors = normalize_contact_payload({
            "name": "Alex",
            "email": "alex@example.com",
            "message": "x" * 8000,
        })

        self.assertIn("message", errors)
        self.assertIn("5000", errors["message"])
        self.assertEqual(len(normalized["message"]), 5000)


class ProjectCatalogTests(unittest.TestCase):
    def test_filters_by_search_and_technology_case_insensitively(self):
        results = project_catalog.filter_projects(
            query="molecular", technology="pytorch"
        )
        self.assertEqual([project.slug for project in results], [
            "molecular-property-prediction"
        ])

    def test_filters_can_be_combined_and_paginated(self):
        results = project_catalog.filter_projects(
            category="AI", featured=True
        )
        page, pagination = project_catalog.paginate_projects(results, limit=1, offset=1)

        self.assertEqual(len(page), 1)
        self.assertEqual(pagination["total"], 3)
        self.assertEqual(pagination["next_offset"], 2)

    def test_summary_counts_categories_and_technologies(self):
        summary = project_catalog.project_summary()
        self.assertEqual(summary["total"], len(project_catalog.PROJECTS))
        self.assertEqual(summary["featured"], len(project_catalog.PROJECTS))
        self.assertGreater(summary["technologies"]["Python"], 0)

    def test_project_serialization_includes_frontend_tools_string(self):
        data = project_catalog.PROJECTS[0].to_dict()
        self.assertIsInstance(data["technologies"], list)
        self.assertIn("PyTorch", data["tools"])
        self.assertEqual(data["slug"], "molecular-property-prediction")


class RateLimiterTests(unittest.TestCase):
    def test_sliding_window_blocks_until_oldest_request_expires(self):
        now = [100.0]
        limiter = SlidingWindowRateLimiter(
            max_requests=2,
            window_seconds=10,
            clock=lambda: now[0],
        )

        self.assertTrue(limiter.allow("client"))
        now[0] = 105.0
        self.assertTrue(limiter.allow("client"))
        self.assertFalse(limiter.allow("client"))
        now[0] = 110.0
        self.assertTrue(limiter.allow("client"))
        self.assertEqual(limiter.remaining("client"), 0)

    def test_rejects_invalid_limits_and_empty_keys(self):
        with self.assertRaises(ValueError):
            SlidingWindowRateLimiter(0, 60)
        limiter = SlidingWindowRateLimiter(1, 60)
        with self.assertRaises(ValueError):
            limiter.allow("")

    def test_reset_can_clear_one_or_all_clients(self):
        limiter = SlidingWindowRateLimiter(1, 60)
        self.assertTrue(limiter.allow("first"))
        self.assertTrue(limiter.allow("second"))
        limiter.reset("first")
        self.assertEqual(limiter.remaining("first"), 1)
        self.assertEqual(limiter.remaining("second"), 0)
        limiter.reset()
        self.assertEqual(limiter.remaining("second"), 1)


class SecurityTests(unittest.TestCase):
    def test_admin_tokens_are_required_and_compared_as_bearer_values(self):
        self.assertFalse(is_admin_authorized(None, "secret"))
        self.assertFalse(is_admin_authorized("Basic secret", "secret"))
        self.assertFalse(is_admin_authorized("Bearer wrong", "secret"))
        self.assertFalse(is_admin_authorized("Bearer secret", ""))
        self.assertTrue(is_admin_authorized("Bearer secret", "secret"))
        self.assertTrue(is_admin_authorized("bearer secret", "secret"))


class DatabaseTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory(prefix="portfolio-db-test-")
        self.db_path = str(Path(self.directory.name) / "test.sqlite3")
        database.init_db(self.db_path)

    def tearDown(self):
        self.directory.cleanup()

    def test_contact_lifecycle_filtering_and_pagination(self):
        first_id = database.save_contact_message(
            "Alex One", "one@example.com", "Role", "Interested in a role", self.db_path
        )
        second_id = database.save_contact_message(
            "Jamie Two", "two@example.com", "Question", "A project question", self.db_path
        )
        self.assertEqual(database.count_contact_messages(db_path=self.db_path), 2)

        self.assertTrue(
            database.update_contact_status(second_id, "read", self.db_path)
        )
        self.assertFalse(
            database.update_contact_status(99999, "read", self.db_path)
        )
        read_messages = database.fetch_contact_messages(
            status="read", db_path=self.db_path
        )
        self.assertEqual([record["id"] for record in read_messages], [second_id])

        searched = database.fetch_contact_messages(
            search="role", db_path=self.db_path
        )
        self.assertEqual([record["id"] for record in searched], [first_id])
        self.assertEqual(
            database.count_contact_messages(search="role", db_path=self.db_path), 1
        )
        page = database.fetch_contact_messages(
            limit=1, offset=1, db_path=self.db_path
        )
        self.assertEqual(len(page), 1)
        self.assertEqual(page[0]["id"], first_id)

    def test_migrates_existing_contact_table_without_losing_rows(self):
        legacy_path = str(Path(self.directory.name) / "legacy.sqlite3")
        connection = sqlite3.connect(legacy_path)
        try:
            connection.execute(
                """
                CREATE TABLE contact_messages (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    subject TEXT,
                    message TEXT NOT NULL,
                    created_at TEXT
                )
                """
            )
            connection.execute(
                "INSERT INTO contact_messages (id, name, email, message) "
                "VALUES (7, 'Legacy User', 'legacy@example.com', 'Saved before upgrade')"
            )
            connection.commit()
        finally:
            connection.close()

        database.init_db(legacy_path)
        messages = database.fetch_contact_messages(db_path=legacy_path)
        self.assertEqual(messages[0]["id"], 7)
        self.assertEqual(messages[0]["status"], "new")
        self.assertIsNotNone(messages[0]["updated_at"])

    def test_analytics_summary_and_retention(self):
        database.record_analytics_event(
            "page_view", "/", db_path=self.db_path
        )
        database.record_analytics_event(
            "project_view",
            "/work",
            "molecular-property-prediction",
            db_path=self.db_path,
        )
        summary = database.fetch_analytics_summary(db_path=self.db_path)
        self.assertEqual(summary["total_events"], 2)
        self.assertEqual(summary["by_type"]["page_view"], 1)
        self.assertEqual(summary["top_projects"][0]["count"], 1)

        database.delete_analytics_before(
            "2999-01-01 00:00:00", db_path=self.db_path
        )
        self.assertEqual(
            database.fetch_analytics_summary(db_path=self.db_path)["total_events"], 0
        )


class AnalyticsValidationTests(unittest.TestCase):
    def test_validates_event_shape_and_project_view_requirement(self):
        event = analytics.validate_event({
            "event_type": "project_view",
            "page": "/work",
            "project_slug": "molecular-property-prediction",
        })
        self.assertEqual(event["page"], "/work")

        invalid_events = [
            [],
            {"event_type": "unknown", "page": "/"},
            {"event_type": "project_view", "page": "/work"},
            {"event_type": "page_view", "page": "//external.example"},
            {
                "event_type": "page_view",
                "page": "/",
                "project_slug": "invalid/slug",
            },
        ]
        for payload in invalid_events:
            with self.subTest(payload=payload):
                with self.assertRaises(analytics.AnalyticsValidationError):
                    analytics.validate_event(payload)

    def test_parses_dates_and_purges_old_events(self):
        self.assertEqual(
            analytics.parse_start_date("2026-01-02"), "2026-01-02 00:00:00"
        )
        with self.assertRaises(analytics.AnalyticsValidationError):
            analytics.parse_start_date("not-a-date")
        self.assertEqual(
            analytics.purge_old_events(
                7,
                today=date(2026, 1, 10),
                db_path=os.environ["CONTACTS_DB_PATH"],
            ),
            0,
        )


class ApiTests(unittest.TestCase):
    def setUp(self):
        self.client = backend_app.app.test_client()
        contact_limiter.reset()
        with database.get_connection(os.environ["CONTACTS_DB_PATH"]) as connection:
            connection.execute("DELETE FROM contact_messages")
            connection.execute("DELETE FROM analytics_events")
        self.original_settings = backend_app.settings
        backend_app.settings = SimpleNamespace(
            admin_token="test-token",
            service_name="Portfolio Test API",
            db_path=os.environ["CONTACTS_DB_PATH"],
            host="127.0.0.1",
            port=5000,
            allowed_origins=("*",),
            contact_rate_limit=5,
            contact_rate_window=60,
        )

    def tearDown(self):
        backend_app.settings = self.original_settings
        contact_limiter.reset()

    def test_project_list_supports_search_filter_and_pagination(self):
        response = self.client.get(
            "/api/projects?q=healthcare&limit=1&offset=0"
        )

        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertEqual(len(payload["projects"]), 1)
        self.assertEqual(payload["projects"][0]["slug"], "ai-healthcare-application")
        self.assertEqual(payload["pagination"]["total"], 1)

    def test_project_detail_and_invalid_query_responses(self):
        response = self.client.get("/api/projects/molecular-property-prediction")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.get_json()["project"]["slug"], "molecular-property-prediction"
        )
        self.assertEqual(
            self.client.get("/api/projects/not-a-project").status_code, 404
        )
        self.assertEqual(self.client.get("/api/projects?limit=invalid").status_code, 400)
        self.assertEqual(self.client.get("/api/projects?featured=yes").status_code, 400)

    def test_contact_endpoint_validates_and_persists_submission(self):
        response = self.client.post(
            "/api/contact",
            json={
                "name": "Taylor",
                "email": "taylor@example.com",
                "subject": "Project inquiry",
                "message": "I would like to discuss a project.",
            },
            environ_base={"REMOTE_ADDR": "198.51.100.10"},
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.get_json()["success"])
        self.assertEqual(
            database.count_contact_messages(db_path=os.environ["CONTACTS_DB_PATH"]), 1
        )

    def test_contact_endpoint_rate_limits_repeated_submissions(self):
        body = {
            "name": "Taylor",
            "email": "taylor@example.com",
            "message": "I would like to discuss a project.",
        }
        statuses = [
            self.client.post(
                "/api/contact",
                json=body,
                environ_base={"REMOTE_ADDR": "198.51.100.11"},
            ).status_code
            for _ in range(6)
        ]

        self.assertEqual(statuses, [201, 201, 201, 201, 201, 429])

    def test_admin_message_access_requires_token_and_supports_status_updates(self):
        message_id = database.save_contact_message(
            "Admin Check",
            "admin-check@example.com",
            "Private",
            "This message must not be public.",
            os.environ["CONTACTS_DB_PATH"],
        )
        self.assertEqual(
            self.client.get("/api/contact/messages").status_code, 401
        )

        response = self.client.get(
            "/api/contact/messages",
            headers={"Authorization": "Bearer test-token"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["total"], 1)

        updated = self.client.patch(
            f"/api/contact/messages/{message_id}",
            headers={"Authorization": "Bearer test-token"},
            json={"status": "replied"},
        )
        self.assertEqual(updated.status_code, 200)
        message = database.fetch_contact_messages(
            db_path=os.environ["CONTACTS_DB_PATH"]
        )[0]
        self.assertEqual(message["status"], "replied")

    def test_admin_routes_fail_closed_when_no_token_is_configured(self):
        backend_app.settings = SimpleNamespace(
            admin_token="",
            service_name="Portfolio Test API",
            db_path=os.environ["CONTACTS_DB_PATH"],
            host="127.0.0.1",
            port=5000,
            allowed_origins=("*",),
            contact_rate_limit=5,
            contact_rate_window=60,
        )

        response = self.client.get("/api/analytics/summary")

        self.assertEqual(response.status_code, 503)

    def test_analytics_events_are_public_but_summary_is_admin_only(self):
        event = self.client.post(
            "/api/analytics/events",
            json={"event_type": "page_view", "page": "/"},
        )
        self.assertEqual(event.status_code, 201)
        self.assertEqual(
            self.client.post(
                "/api/analytics/events",
                json={"event_type": "page_view", "page": "//external.example"},
            ).status_code,
            422,
        )
        self.assertEqual(
            self.client.get("/api/analytics/summary").status_code, 401
        )
        summary = self.client.get(
            "/api/analytics/summary?since=2026-01-01",
            headers={"Authorization": "Bearer test-token"},
        )
        self.assertEqual(summary.status_code, 200)
        self.assertEqual(summary.get_json()["summary"]["total_events"], 1)


if __name__ == "__main__":
    unittest.main()
