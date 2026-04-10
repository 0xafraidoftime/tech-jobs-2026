"""
tech-jobs-2026 / src/scraper.py
--------------------------------
Optional helper to fetch and update job + salary data.
Run: python3 src/scraper.py

Outputs: data/jobs.json (updates in-place)

Requirements: pip install requests beautifulsoup4
"""

import json
import os
from pathlib import Path

OUTPUT_PATH = Path(__file__).parent.parent / "data" / "jobs.json"

# Salary data from Robert Half 2026 Salary Guide (hardcoded as public reference)
# Update these values each year from: https://www.roberthalf.com/us/en/salary-guide
SALARY_DATA = {
    "AI / ML Engineer":             {"low": 134000, "mid": 170750, "high": 193250},
    "Data Scientist":               {"low": 121750, "mid": 153750, "high": 182500},
    "Software Engineer":            {"low": 109250, "mid": 142000, "high": 175500},
    "DevOps / Platform Engineer":   {"low": 118000, "mid": 145750, "high": 173750},
    "Cybersecurity Engineer":       {"low": 118500, "mid": 144000, "high": 190750},
    "Network / Cloud Engineer":     {"low": 110000, "mid": 132000, "high": 155000},
    "IT Project Manager (AI focus)":{"low": 103500, "mid": 122750, "high": 147000},
    "ERP / Business Analyst":       {"low": 101000, "mid": 123250, "high": 142250},
    "Data Analyst":                 {"low": 96250,  "mid": 117250, "high": 138500},
    "Systems Administrator":        {"low": 80250,  "mid": 98000,  "high": 118000},
}

def load_jobs(path: Path) -> list:
    with open(path, "r") as f:
        return json.load(f)

def update_salaries(jobs: list) -> list:
    for job in jobs:
        if job["title"] in SALARY_DATA:
            s = SALARY_DATA[job["title"]]
            job["salaryLow"]  = s["low"]
            job["salaryMid"]  = s["mid"]
            job["salaryHigh"] = s["high"]
    return jobs

def save_jobs(jobs: list, path: Path):
    with open(path, "w") as f:
        json.dump(jobs, f, indent=2)
    print(f"Saved {len(jobs)} roles → {path}")

def print_summary(jobs: list):
    print("\n📊 Tech Jobs 2026 — Salary Summary\n" + "─" * 50)
    for j in sorted(jobs, key=lambda x: x["salaryMid"], reverse=True):
        bar = "█" * int(j["salaryMid"] / 10000)
        print(f"  #{j['rank']:>2}  {j['title']:<32}  ${j['salaryMid']:,}  {bar}")
    print()

if __name__ == "__main__":
    if not OUTPUT_PATH.exists():
        print(f"Error: {OUTPUT_PATH} not found. Run from the repo root.")
        raise SystemExit(1)

    jobs = load_jobs(OUTPUT_PATH)
    jobs = update_salaries(jobs)
    save_jobs(jobs, OUTPUT_PATH)
    print_summary(jobs)
