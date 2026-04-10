# Tech Jobs 2026 — Salary & Skills Dashboard

An interactive dashboard of the **10 most in-demand tech roles in 2026**, mapped to their required skills and sorted from highest to lowest pay.

![Dashboard Preview](https://img.shields.io/badge/roles-10-blue) ![Salaries](https://img.shields.io/badge/salaries-USD_2026-green) ![Data](https://img.shields.io/badge/data-Robert_Half_%7C_BLS-orange)

---

## What's Inside

| Role | Mid Salary | Key Skills |
|------|-----------|-----------|
| AI / ML Engineer | $170K | Python, PyTorch, LLMs, MLOps |
| Data Scientist | $153K | Python, ML, SQL, Statistics |
| Software Engineer | $142K | Python/Java/Go, System Design, APIs |
| DevOps / Platform Engineer | $145K | Kubernetes, Terraform, CI/CD |
| Cybersecurity Engineer | $144K | SIEM, Zero Trust, CISSP |
| Network / Cloud Engineer | $132K | AWS/Azure/GCP, Networking |
| IT Project Manager (AI) | $122K | Agile, PMP, Stakeholder Mgmt |
| ERP / Business Analyst | $123K | SAP, SQL, Process Modeling |
| Data Analyst | $117K | SQL, Power BI, Tableau |
| Systems Administrator | $98K | Linux, Active Directory, VMware |

---

## Usage

### Option 1 — Open directly in browser
```
open public/index.html
```
> Note: the JSON data loads via fetch. If you get a CORS error on `file://`, use Option 2.

### Option 2 — Serve locally (recommended)
```bash
# Python
cd tech-jobs-2026
python3 -m http.server 8080 --directory public
# then open http://localhost:8080

# Node (npx)
npx serve public
```

### Option 3 — Deploy to GitHub Pages
1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/public` folder
4. Done — live at `https://<you>.github.io/tech-jobs-2026/`

---

## Project Structure

```
tech-jobs-2026/
├── public/
│   ├── index.html      # Dashboard UI
│   ├── style.css       # Styles (light + dark mode)
│   └── app.js          # Logic, filtering, chart
├── data/
│   └── jobs.json       # Structured job + salary + skills data
├── src/
│   └── scraper.py      # (optional) script to refresh data
├── README.md
└── .gitignore
```

---

## 🔄 Updating the Data

Edit `data/jobs.json` to update salaries, add roles, or tweak skills. The dashboard reads from this file at runtime — no build step required.

### JSON schema for each role:
```json
{
  "rank": 1,
  "title": "AI / ML Engineer",
  "salaryLow": 134000,
  "salaryMid": 170750,
  "salaryHigh": 193250,
  "demand": "Explosive demand",
  "growth": "Fastest growing — AI roles growing 2x all tech",
  "skills": ["Python", "TensorFlow / PyTorch", "..."],
  "description": "Role description here.",
  "sources": ["Robert Half 2026 Salary Guide", "BLS"]
}
```

---

## Data Sources

- **Robert Half 2026 Demand for Skilled Talent Report** — salary ranges (low/mid/high)
- **Bureau of Labor Statistics (BLS)** — growth projections
- **CIO.com** — in-demand role analysis (April 2026)
- **LSE Executive Education** — UK market & role trends
- **Zero To Mastery** — LinkedIn job posting counts
- **Pace University** — emerging role classification

---

## Features

- Horizontal salary bar chart (Chart.js)
- Search by role name or skill
- Sort by highest pay, A–Z, or entry salary
- Light + dark mode (auto-detects system preference)
- No framework — pure HTML, CSS, vanilla JS
- Works offline (fallback data inline in `app.js`)

---

## License

MIT — free to use, fork, and share.