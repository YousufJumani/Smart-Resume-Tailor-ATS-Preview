# Smart Resume Tailor + ATS Preview
![Alt text] (resume.png)
## Overview
Resume matching tool that compares resume content against a target job description and highlights ATS alignment.

Built for portfolio presentation with:
- a strong visual score area
- matched vs missing keyword groups
- practical rewrite suggestions
- ATS-safe plain-text preview

## Core Features
- Keyword extraction from job descriptions
- Match score with grade (A/B/C/D)
- Split matched and missing keyword chips
- Suggestion list for improving missing skill coverage
- Safe text rendering in preview (HTML escaped)
- Validation for empty resume and empty job description

## Tech Stack
- HTML
- CSS
- Vanilla JavaScript

## Local Development
- `npm run build`
- `npm test`
- `npm run preview`

Preview URL: `http://localhost:4174`

## Deploy On Vercel
1. Push this folder to GitHub.
2. In Vercel, click `Add New...` -> `Project`.
3. Import your repository and set Root Directory to:
	`projects/02-html-css-js-interactive-site/smart-resume-tailor-ats-preview`
4. Set Build Command: `npm run build`
5. Set Output Directory: `dist`
6. Deploy.

No environment variables are required.
