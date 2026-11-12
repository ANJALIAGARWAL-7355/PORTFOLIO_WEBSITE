from dataclasses import asdict, dataclass
from typing import Dict, Iterable, List, Optional, Sequence, Tuple, Union


@dataclass(frozen=True)
class Project:
    slug: str
    number: str
    name: str
    category: str
    technologies: Tuple[str, ...]
    description: str
    status: str
    image: str
    link: str
    featured: bool = True

    def to_dict(self) -> Dict[str, object]:
        record = asdict(self)
        record["technologies"] = list(self.technologies)
        record["tools"] = ", ".join(self.technologies)
        return record


PROJECTS: Tuple[Project, ...] = (
    Project(
        slug="molecular-property-prediction",
        number="01",
        name="Molecular Property Prediction using Machine Learning",
        category="AI & Bioinformatics",
        technologies=("Python", "PyTorch", "RDKit", "Scikit-learn", "Pandas", "NumPy"),
        description=(
            "Predictive machine learning framework analyzing chemical graphs and "
            "molecular descriptors to forecast solubility, binding affinity, and "
            "bioactivity properties."
        ),
        status="Active Research / Development",
        image="/images/project-molecular.svg",
        link="https://github.com/ANJALIAGARWAL-7355",
    ),
    Project(
        slug="ai-healthcare-application",
        number="02",
        name="AI-Powered Healthcare Application",
        category="Computer Vision & Medical AI",
        technologies=("Python", "TensorFlow", "FastAPI", "React.js", "SQLite"),
        description=(
            "Intelligent diagnostic support system utilizing deep convolutional "
            "networks for automated medical imaging analysis and clinical decision assistance."
        ),
        status="Prototype / In Development",
        image="/images/project-healthcare.svg",
        link="https://github.com/ANJALIAGARWAL-7355",
    ),
    Project(
        slug="full-stack-web-application",
        number="03",
        name="Full-Stack Web Application",
        category="Full-Stack Software Engineering",
        technologies=(
            "React.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "SQLite"
        ),
        description=(
            "Modern full-stack web platform built with modular component hierarchies, "
            "responsive layout, secure authentication, and high-performance RESTful APIs."
        ),
        status="In Active Development",
        image="/images/project-fullstack.svg",
        link="https://github.com/ANJALIAGARWAL-7355",
    ),
    Project(
        slug="generative-ai-application",
        number="04",
        name="Generative AI / LLM-Based Application",
        category="Generative AI & LLMs",
        technologies=(
            "Python", "LangChain", "LLMs", "RAG", "Prompt Engineering", "FastAPI"
        ),
        description=(
            "Context-aware generative intelligence system implementing "
            "retrieval-augmented generation over domain-specific corpora with semantic search."
        ),
        status="In Progress",
        image="/images/project-genai.svg",
        link="https://github.com/ANJALIAGARWAL-7355",
    ),
    Project(
        slug="data-analysis-visualization",
        number="05",
        name="Data Analysis and Visualization Project",
        category="Data Science & Visual Modeling",
        technologies=(
            "Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Plotly"
        ),
        description=(
            "End-to-end exploratory data analysis pipeline identifying multi-dimensional "
            "statistical patterns, correlations, and interactive visual reporting dashboards."
        ),
        status="Analytical Case Study",
        image="/images/project-data.svg",
        link="https://github.com/ANJALIAGARWAL-7355",
    ),
)

PROJECTS_BY_SLUG = {project.slug: project for project in PROJECTS}
CATEGORIES = tuple(sorted({project.category for project in PROJECTS}))


def _contains(value: str, query: str) -> bool:
    return query.casefold() in value.casefold()


def filter_projects(
    query: str = "",
    category: str = "",
    technology: str = "",
    status: str = "",
    featured: Optional[bool] = None,
    projects: Sequence[Project] = PROJECTS,
) -> List[Project]:
    search = query.strip()
    category_filter = category.strip()
    technology_filter = technology.strip()
    status_filter = status.strip()
    selected: List[Project] = []

    for project in projects:
        searchable = " ".join(
            (
                project.name,
                project.category,
                project.description,
                project.status,
                " ".join(project.technologies),
            )
        )
        if search and not _contains(searchable, search):
            continue
        if category_filter and not _contains(project.category, category_filter):
            continue
        if technology_filter and not any(
            _contains(item, technology_filter) for item in project.technologies
        ):
            continue
        if status_filter and not _contains(project.status, status_filter):
            continue
        if featured is not None and project.featured is not featured:
            continue
        selected.append(project)

    return selected


def paginate_projects(
    projects: Sequence[Project], limit: int, offset: int
) -> Tuple[List[Project], Dict[str, Union[int, None]]]:
    total = len(projects)
    page = list(projects[offset : offset + limit])
    return page, {
        "total": total,
        "limit": limit,
        "offset": offset,
        "next_offset": offset + len(page) if offset + len(page) < total else None,
    }


def project_summary(projects: Iterable[Project] = PROJECTS) -> Dict[str, object]:
    records = list(projects)
    counts_by_category: Dict[str, int] = {}
    counts_by_technology: Dict[str, int] = {}
    for project in records:
        counts_by_category[project.category] = (
            counts_by_category.get(project.category, 0) + 1
        )
        for technology in project.technologies:
            counts_by_technology[technology] = (
                counts_by_technology.get(technology, 0) + 1
            )

    return {
        "total": len(records),
        "featured": sum(1 for project in records if project.featured),
        "categories": dict(sorted(counts_by_category.items())),
        "technologies": dict(
            sorted(counts_by_technology.items(), key=lambda item: (-item[1], item[0]))
        ),
    }
