import os
from collections import defaultdict
from pathlib import Path
from typing import Dict, List

CODE_EXTENSIONS = {".py", ".ts", ".tsx", ".js", ".jsx", ".css", ".html", ".json"}
SKIP_DIRS = {".git", ".venv", "node_modules", "dist", "build", "__pycache__"}


def summarize_codebase(root_dir: str) -> Dict[str, List[int]]:
    counts = defaultdict(int)
    totals = defaultdict(int)

    for directory, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = [name for name in dirnames if name not in SKIP_DIRS]
        for filename in filenames:
            path = Path(directory) / filename
            ext = path.suffix.lower()
            if ext not in CODE_EXTENSIONS:
                continue
            try:
                with path.open("r", encoding="utf-8") as handle:
                    lines = sum(1 for _ in handle)
            except (OSError, UnicodeDecodeError):
                continue
            counts[ext] += 1
            totals[ext] += lines

    return {"files": dict(counts), "lines": dict(totals)}


def python_percentage(root_dir: str) -> float:
    summary = summarize_codebase(root_dir)
    python_files = summary["files"].get(".py", 0)
    total_files = sum(summary["files"].values())
    if total_files == 0:
        return 0.0
    return (python_files / total_files) * 100


if __name__ == "__main__":
    project_root = str(Path(__file__).resolve().parent.parent)
    ratio = python_percentage(project_root)
    print(f"Python share of project source files: {ratio:.2f}%")
