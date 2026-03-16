function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function extractKeywords(text) {
  const stopWords = new Set([
    "the", "and", "for", "with", "you", "your", "will", "are", "our", "this", "that",
    "from", "into", "have", "has", "role", "team", "teams", "developer", "engineer",
    "about", "able", "also", "been", "can", "its", "not", "was", "who", "but",
    "they", "their", "them", "all", "any", "one", "two", "new", "use", "strong",
  ]);

  const matches = text
    .toLowerCase()
    .replace(/[^a-z0-9+/#\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopWords.has(token));

  const frequency = new Map();
  matches.forEach((token) => {
    frequency.set(token, (frequency.get(token) || 0) + 1);
  });

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([token]) => token);
}

function scoreGrade(score) {
  if (score >= 80) return { letter: "A", label: "Excellent", cls: "grade-a" };
  if (score >= 65) return { letter: "B", label: "Good",      cls: "grade-b" };
  if (score >= 45) return { letter: "C", label: "Fair",      cls: "grade-c" };
  return                    { letter: "D", label: "Needs Work", cls: "grade-d" };
}

function analyzeResume(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const result = document.querySelector("#resume-result");
  const scorePill = document.querySelector("#score-pill");
  const data = new FormData(form);
  const jobDescription = String(data.get("jobDescription") || "").trim();
  const resumeContent  = String(data.get("resumeContent")  || "").trim();

  if (!jobDescription) {
    result.innerHTML = `<div class="alert-box warn-box"><strong>\u26a0\ufe0f Paste a job description</strong><p>The job description field is empty. Add one to extract keywords and measure your match.</p></div>`;
    scorePill.textContent = "\u2014"; scorePill.className = "";
    return;
  }
  if (!resumeContent) {
    result.innerHTML = `<div class="alert-box warn-box"><strong>\u26a0\ufe0f Paste your resume</strong><p>The resume field is empty. Add your resume text to compare it against the job description.</p></div>`;
    scorePill.textContent = "\u2014"; scorePill.className = "";
    return;
  }

  const topKeywords = extractKeywords(jobDescription).slice(0, 14);

  if (topKeywords.length === 0) {
    result.innerHTML = `<div class="alert-box info-box"><strong>\u2139\ufe0f No keywords found</strong><p>The job description doesn&apos;t contain meaningful keywords after filtering. Try a more detailed job posting.</p></div>`;
    scorePill.textContent = "\u2014"; scorePill.className = "";
    return;
  }

  const resumeLower = resumeContent.toLowerCase();
  const matched = topKeywords.filter((kw) => resumeLower.includes(kw));
  const missing  = topKeywords.filter((kw) => !resumeLower.includes(kw));
  const score = Math.round((matched.length / topKeywords.length) * 100);
  const grade = scoreGrade(score);

  scorePill.textContent = `${score}%`;
  scorePill.className = grade.cls;

  const safeResume = escapeHtml(
    resumeContent.split("\n").map((l) => l.trim()).filter(Boolean).join("\n")
  );

  result.innerHTML = `
    <div class="score-visual">
      <div class="score-ring ${grade.cls}">
        <span class="score-pct">${score}%</span>
        <span class="score-letter">${grade.letter}</span>
      </div>
      <div class="score-meta">
        <strong class="grade-label ${grade.cls}">${grade.label} ATS Match</strong>
        <p class="note">${matched.length} of ${topKeywords.length} key terms found in your resume.</p>
        <div class="mini-bar-track"><div class="mini-bar-fill" style="width:${score}%"></div></div>
      </div>
    </div>

    <div class="keyword-groups">
      <div class="kw-group">
        <div class="kw-group-title">\u2705 Matched (${matched.length})</div>
        <div class="chips">
          ${matched.length
            ? matched.map((kw) => `<span class="chip chip-matched">${escapeHtml(kw)}</span>`).join("")
            : `<span class="note">None matched yet</span>`}
        </div>
      </div>
      <div class="kw-group">
        <div class="kw-group-title">\u274c Missing (${missing.length})</div>
        <div class="chips">
          ${missing.length
            ? missing.map((kw) => `<span class="chip chip-missing">${escapeHtml(kw)}</span>`).join("")
            : `<span class="note good">All keywords found!</span>`}
        </div>
      </div>
    </div>

    ${missing.length ? `
    <div class="suggestions">
      <div class="suggestions-title">\ud83d\udca1 How to improve</div>
      <ul>
        ${missing.slice(0, 5).map((kw) => `<li>Add a result-oriented bullet demonstrating <strong>${escapeHtml(kw)}</strong> with a measurable outcome.</li>`).join("")}
      </ul>
    </div>` : ""}

    <div class="ats-preview-wrap">
      <div class="preview-title">\ud83d\udcc4 ATS Text Preview</div>
      <pre>${safeResume}</pre>
      <p class="note">ATS scanners parse plain text. Avoid tables, graphics, and columns. Use clear headings and bullet points.</p>
    </div>
  `;
}

const form = document.querySelector("#resume-form");
form.addEventListener("submit", analyzeResume);
form.requestSubmit();
