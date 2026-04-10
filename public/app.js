const DATA_URL = '../data/jobs.json';

const fmt = n => '$' + (n / 1000).toFixed(0) + 'K';

async function loadJobs() {
  try {
    const res = await fetch(DATA_URL);
    return await res.json();
  } catch {
    // fallback: inline data if fetch fails (e.g. file:// protocol)
    return FALLBACK_DATA;
  }
}

function renderStats(jobs) {
  const avgMid = Math.round(jobs.reduce((s, j) => s + j.salaryMid, 0) / jobs.length);
  const topJob = jobs[0];
  const allSkills = [...new Set(jobs.flatMap(j => j.skills))];
  const el = document.getElementById('stats');
  el.innerHTML = `
    <div class="stat-card"><div class="label">roles tracked</div><div class="value">${jobs.length}</div></div>
    <div class="stat-card"><div class="label">avg mid salary</div><div class="value">${fmt(avgMid)}</div></div>
    <div class="stat-card"><div class="label">top paying role</div><div class="value" style="font-size:15px;padding-top:4px;">${topJob.title}</div></div>
    <div class="stat-card"><div class="label">unique skills mapped</div><div class="value">${allSkills.length}</div></div>
  `;
}

function renderChart(jobs) {
  const ctx = document.getElementById('salaryChart').getContext('2d');
  const labels = jobs.map(j => j.title.replace(' / ', '/'));
  const midData = jobs.map(j => j.salaryMid);
  const lowData = jobs.map(j => j.salaryLow);
  const highData = jobs.map(j => j.salaryHigh);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Mid salary',
          data: midData,
          backgroundColor: 'rgba(55,138,221,0.85)',
          borderRadius: 4,
          order: 1
        },
        {
          label: 'Low salary',
          data: lowData,
          backgroundColor: 'rgba(55,138,221,0.25)',
          borderRadius: 4,
          order: 2
        },
        {
          label: 'High salary',
          data: highData,
          backgroundColor: 'rgba(55,138,221,0.12)',
          borderRadius: 4,
          order: 3
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${fmt(ctx.raw)}`
          }
        }
      },
      scales: {
        x: {
          ticks: {
            callback: v => fmt(v),
            color: '#888'
          },
          grid: { color: 'rgba(128,128,128,0.1)' }
        },
        y: {
          ticks: { color: '#888', font: { size: 12 } },
          grid: { display: false }
        }
      }
    }
  });
}

function renderJobs(jobs, maxMid) {
  const container = document.getElementById('job-list');
  if (!jobs.length) {
    container.innerHTML = '<div class="no-results">No roles match your search.</div>';
    return;
  }
  container.innerHTML = jobs.map(j => {
    const pct = Math.round((j.salaryMid / maxMid) * 100);
    const skills = j.skills.map(s => `<span class="badge badge-purple">${s}</span>`).join('');
    return `
      <div class="job-card">
        <div class="job-top">
          <div class="job-left">
            <span class="rank">#${j.rank}</span>
            <div>
              <div class="job-title">${j.title}</div>
              <div class="job-badges">
                <span class="badge badge-blue">${fmt(j.salaryLow)} – ${fmt(j.salaryHigh)}</span>
                <span class="badge badge-green">${j.demand}</span>
              </div>
            </div>
          </div>
          <div class="salary-right">
            <div class="salary-mid">${fmt(j.salaryMid)}</div>
            <div class="salary-range">mid salary</div>
          </div>
        </div>
        <div class="bar-bg"><div class="bar-fill" style="width:${pct}%"></div></div>
        <div class="job-desc">${j.description}</div>
        <div class="skills-row">${skills}</div>
      </div>
    `;
  }).join('');
}

async function init() {
  const jobs = await loadJobs();
  const maxMid = Math.max(...jobs.map(j => j.salaryMid));

  renderStats(jobs);
  renderChart(jobs);
  renderJobs(jobs, maxMid);

  const searchEl = document.getElementById('search');
  const sortEl = document.getElementById('sort');

  function update() {
    const q = searchEl.value.toLowerCase();
    const sortKey = sortEl.value;

    let filtered = jobs.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.skills.some(s => s.toLowerCase().includes(q)) ||
      j.description.toLowerCase().includes(q)
    );

    if (sortKey === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortKey === 'salaryLow') {
      filtered.sort((a, b) => b.salaryLow - a.salaryLow);
    } else {
      filtered.sort((a, b) => a.rank - b.rank);
    }

    renderJobs(filtered, maxMid);
  }

  searchEl.addEventListener('input', update);
  sortEl.addEventListener('change', update);
}

init();

// Inline fallback data (used when opened via file:// without a server)
const FALLBACK_DATA = [
  { rank:1, title:"AI / ML Engineer", salaryLow:134000, salaryMid:170750, salaryHigh:193250, demand:"Explosive demand", skills:["Python","TensorFlow / PyTorch","LLMs & Transformers","MLOps","Cloud (AWS/GCP/Azure)","Statistics","Data pipelines"], description:"Design, build, and deploy AI/ML systems including large language models, recommendation engines, and automation pipelines." },
  { rank:2, title:"Data Scientist", salaryLow:121750, salaryMid:153750, salaryHigh:182500, demand:"Very high demand", skills:["Python / R","Machine Learning","SQL","Statistical modeling","Data visualization","Spark / BigQuery","Experimentation"], description:"Analyze complex datasets to extract insights, build predictive models, and inform business strategy." },
  { rank:3, title:"Software Engineer", salaryLow:109250, salaryMid:142000, salaryHigh:175500, demand:"61K+ open roles on LinkedIn", skills:["Python / Java / Go","System design","APIs & microservices","Git / CI-CD","Databases","Agile","Cloud platforms"], description:"Design and build software products — frontend, backend, or full-stack — across web, mobile, and infrastructure." },
  { rank:4, title:"DevOps / Platform Engineer", salaryLow:118000, salaryMid:145750, salaryHigh:173750, demand:"High — 74% of firms use DevOps", skills:["Kubernetes / Docker","Terraform / IaC","CI/CD pipelines","Linux","Monitoring (Datadog/Grafana)","Cloud (AWS/Azure/GCP)","Bash / Python scripting"], description:"Own the infrastructure and deployment pipelines that keep software running reliably at scale." },
  { rank:5, title:"Cybersecurity Engineer", salaryLow:118500, salaryMid:144000, salaryHigh:190750, demand:"33% BLS growth to 2033", skills:["SIEM / SOAR","Zero Trust architecture","Pen testing","Cloud security","CISSP / CCSP","Threat modeling","Incident response"], description:"Protect systems and data from cyber threats through architecture, monitoring, and incident response." },
  { rank:6, title:"Network / Cloud Engineer", salaryLow:110000, salaryMid:132000, salaryHigh:155000, demand:"High — multi-cloud adoption surge", skills:["AWS / Azure / GCP","Networking (TCP/IP, VLANs)","Terraform","Load balancing","VPN & hybrid cloud","Monitoring","Security compliance"], description:"Design and manage cloud-based and hybrid network infrastructure for organizations at scale." },
  { rank:7, title:"IT Project Manager (AI focus)", salaryLow:103500, salaryMid:122750, salaryHigh:147000, demand:"High — every AI project needs one", skills:["Agile / Scrum / PMP","Stakeholder management","Risk management","JIRA / Confluence","Budgeting","Technical literacy (AI/ML)","Communication"], description:"Lead cross-functional teams delivering AI and tech projects on time, on budget, and aligned to business goals." },
  { rank:8, title:"ERP / Business Analyst", salaryLow:101000, salaryMid:123250, salaryHigh:142250, demand:"Steady demand", skills:["SAP / Oracle / Salesforce","Requirements gathering","SQL","Process modeling","Data analysis","Stakeholder management","Agile"], description:"Bridge the gap between business needs and technical systems, especially ERP and enterprise platforms." },
  { rank:9, title:"Data Analyst", salaryLow:96250, salaryMid:117250, salaryHigh:138500, demand:"High across all industries", skills:["SQL","Python / R","Tableau / Power BI","Excel","Statistics","Data storytelling","ETL pipelines"], description:"Turn raw data into actionable business insights through reporting, dashboards, and statistical analysis." },
  { rank:10, title:"Systems Administrator", salaryLow:80250, salaryMid:98000, salaryHigh:118000, demand:"Stable, essential role", skills:["Linux / Windows Server","Active Directory","Virtualization (VMware)","Backup & recovery","Scripting (PowerShell/Bash)","Networking","Ticketing systems"], description:"Keep servers, networks, and operating systems running smoothly — the backbone of IT operations." }
];
