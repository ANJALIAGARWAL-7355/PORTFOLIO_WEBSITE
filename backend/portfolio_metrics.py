import os
from pathlib import Path
from typing import Dict

CODE_EXTENSIONS = {".py", ".ts", ".tsx", ".js", ".jsx", ".css", ".html"}
SKIP_DIRS = {
    ".git",
    ".venv",
    "node_modules",
    "dist",
    "build",
    "__pycache__",
    "draco",
}


def summarize_codebase(root_dir: str) -> Dict[str, Dict[str, int]]:
    files: Dict[str, int] = {}
    byte_counts: Dict[str, int] = {}

    for directory, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = [name for name in dirnames if name not in SKIP_DIRS]
        for filename in filenames:
            path = Path(directory) / filename
            ext = path.suffix.lower()
            if ext not in CODE_EXTENSIONS:
                continue
            try:
                size = path.stat().st_size
            except OSError:
                continue
            files[ext] = files.get(ext, 0) + 1
            byte_counts[ext] = byte_counts.get(ext, 0) + size

    return {"files": files, "bytes": byte_counts}


def python_percentage(root_dir: str) -> float:
    summary = summarize_codebase(root_dir)
    python_bytes = summary["bytes"].get(".py", 0)
    total_bytes = sum(summary["bytes"].values())
    if total_bytes == 0:
        return 0.0
    return (python_bytes / total_bytes) * 100


if __name__ == "__main__":
    project_root = str(Path(__file__).resolve().parent.parent)
    ratio = python_percentage(project_root)
    print(f"Python share of tracked-source-like bytes: {ratio:.2f}%")
