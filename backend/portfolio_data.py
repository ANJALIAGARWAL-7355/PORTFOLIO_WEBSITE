"""Static portfolio metadata used by the backend service."""

PORTFOLIO_STATS = {
    "name": "Anjali Agarwal",
    "role": "AI/ML Engineer & Full-Stack Developer",
    "experience_years": 2,
    "focus_areas": [
        "machine learning",
        "web engineering",
        "database design",
        "product strategy",
    ],
    "projects": [
        "portfolio experience platform",
        "healthcare intelligence dashboard",
        "molecular modeling workspace",
        "generative AI app prototypes",
    ],
}


def summarize_portfolio() -> dict:
    return {
        "profile": PORTFOLIO_STATS["name"],
        "role": PORTFOLIO_STATS["role"],
        "specialties": len(PORTFOLIO_STATS["focus_areas"]),
        "project_count": len(PORTFOLIO_STATS["projects"]),
    }
