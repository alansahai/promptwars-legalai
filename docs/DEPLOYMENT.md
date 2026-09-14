# Deployment Guide

This guide covers two things, in order:

1. **Pushing this code to your own GitHub repository** (manual, step-by-step — the project folder
   is not a git repository yet, so start here even if you plan to deploy later).
2. **Deploying it** to Vercel (frontend/API) and, optionally, Render/Railway (a standalone backend).

For how to run the project **locally** first, see the "Running locally" section in
[`README.md`](../README.md) — do that before deploying, so you know the app actually works.

---

## Part 0 — Push your code to GitHub (manual)

These are plain `git`/`gh` commands — run them yourself in a terminal open at the project folder
(`C:\Users\SRIT\Downloads\PROMPTWARS EXCL` or wherever you keep it). Nothing here is run for you
automatically.

### 0.1 Check git is installed

```powershell
git --version
```

If that fails, install Git for Windows from https://git-scm.com/download/win, then reopen your
terminal.

### 0.2 Set your identity (skip if you've used git before on this machine)

```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

### 0.3 Initialize the repository

From inside the project folder:

```powershell
git init
git branch -M main
```

### 0.4 Double-check secrets won't be committed

This project's `.gitignore` already excludes `.env`, `.env.local`, and `node_modules/`. Confirm
before your first commit:

```powershell
git status
```

**`.env.local` (which holds your real `GEMINI_API_KEY`) must NOT appear in this list.** If it does,
stop and fix `.gitignore` before continuing — never commit a real API key.

### 0.5 Stage and commit everything

```powershell
git add .
git commit -m "Initial commit: Legal AI Assistant"
```

### 0.6 Create the GitHub repository

**Option A — GitHub CLI** (if you have `gh` installed: `gh --version` to check):

```powershell
gh repo create legal-ai-poc --public --source=. --remote=origin --push
```

This single command creates the GitHub repo, wires up the remote, and pushes in one step — if it
succeeds, skip straight to [0.8](#08-verify).

**Option B — GitHub website** (no CLI required):

1. Go to https://github.com/new
2. Repository name: `legal-ai-poc` (or anything you like)
3. Leave it **empty** — do NOT check "Add a README" or "Add .gitignore" (you already have both;
   checking these creates conflicting files and complicates your first push)
4. Click **Create repository**
5. Copy the repository URL it shows you (HTTPS form, e.g.
   `https://github.com/YOUR_USERNAME/legal-ai-poc.git`)

### 0.7 Connect and push (Option B only)

```powershell
git remote add origin https://github.com/YOUR_USERNAME/legal-ai-poc.git
git push -u origin main
```

Replace the URL with the one GitHub gave you. If prompted to sign in, follow the browser/device
flow GitHub shows.

### 0.8 Verify

```powershell
git remote -v
```

should show your `origin` pointing at GitHub. Open the repository URL in a browser — you should
see all the project files (and `.env.local` should **not** be among them).

### 0.9 Update the CI badges

Open `README.md` and replace `OWNER/REPO` in the two badge URLs near the top with your actual
`your-username/legal-ai-poc`, then commit that change:

```powershell
git add README.md
git commit -m "Fix CI badge URLs"
git push
```

Within a minute of pushing, check the **Actions** tab on GitHub — the `CI` and `CodeQL` workflows
already committed in `.github/workflows/` should start running automatically.

### Ongoing workflow (every time you make changes after this)

```powershell
git add .
git commit -m "Describe what changed"
git push
```

---

## Part 1 — Deploying

### Overview

This app can be deployed as a single Vercel project (frontend + API routes), or split across
Vercel (frontend) and Render/Railway (Express backend) if you want an independently-scalable API.
The single-deployment path is simplest and is what's recommended for a demo/submission.

### Prerequisites

- Your code pushed to GitHub (Part 0, above)
- A Vercel account (free tier is enough) — https://vercel.com/signup
- A Gemini API key from https://aistudio.google.com/app/apikey
- (Optional, for split deployment) A Render or Railway account

---

### Option A: Single deployment on Vercel (recommended)

1. Go to https://vercel.com/new and import the GitHub repository you just pushed.
2. Framework preset: Next.js (auto-detected).
3. Add environment variables in the Vercel project settings, under **Environment Variables**:
   - `GEMINI_API_KEY` = your Gemini key
   - `GEMINI_MODEL` = `gemini-2.5-flash` (optional, this is the default)
4. Click **Deploy**. Vercel builds with `next build` and serves `pages/api/*` as serverless
   functions — these call the Gemini API directly, so no separate backend is required.
5. Once deployed, open the URL Vercel gives you and verify: upload a document, run
   Simplify/Risks, compare two documents, and ask a question.

Note: because `pages/api/*` run as serverless functions, uploaded documents held in the in-memory
store (`storageService.ts`) may not survive across cold starts/different function instances. If
you rely on `documentId` reuse in production, prefer sending `documentContent` directly, or wire in
a real datastore.

---

### Option B: Split deployment (Vercel frontend + Render backend)

#### Backend on Render

1. Go to https://dashboard.render.com and create a new **Web Service** from your GitHub repository.
2. Build command: `npm install`
3. Start command: `npm run start:server`
4. Environment variables:
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL` (optional)
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://<your-vercel-app>.vercel.app`
   - `PORT=3001` (Render provides its own `PORT`; the app reads `process.env.PORT`)
5. Deploy and verify `GET https://<backend>.onrender.com/api/health` returns `{ "status": "ok" }`.

#### Frontend on Vercel

1. Import the repository into Vercel as in Option A.
2. Environment variables:
   - `NEXT_PUBLIC_API_URL=https://<backend>.onrender.com`
3. Update the frontend fetch calls (`src/components/*`) to call
   `${process.env.NEXT_PUBLIC_API_URL}/api/...` instead of relative `/api/...` paths if you want all
   traffic to go to the standalone backend.
4. Deploy and verify in an incognito window.

---

## Part 2 — Post-deployment checklist

- [ ] `GEMINI_API_KEY` is set only as an environment variable, never committed to the repo
- [ ] `/api/health` (or backend `/api/health`) returns 200
- [ ] Upload accepts PDF/DOCX/TXT and rejects other types (415) and oversized files (413)
- [ ] Simplify, Risks, Compare, and Ask all return results end-to-end
- [ ] CORS: backend `FRONTEND_URL` matches the actual frontend origin
- [ ] Rate limiting returns 429 after exceeding the configured request budget
- [ ] GitHub Actions (`CI` and `CodeQL`) are green on the pushed branch

## Part 3 — Troubleshooting

**"fatal: not a git repository"** — you're not inside the project folder, or Part 0.3 (`git init`)
hasn't been run yet.

**`git push` asks for a password and rejects it** — GitHub no longer accepts account passwords for
git operations. Use the browser sign-in prompt Git for Windows shows, or set up a
[personal access token](https://github.com/settings/tokens) and use that as the password.

**"GEMINI_API_KEY environment variable is not set"** — set it in the deployment platform's
environment variables panel, not in a committed `.env` file.

**CORS errors in the browser console** — confirm `FRONTEND_URL` on the backend exactly matches the
frontend's origin (including protocol and no trailing slash).

**Large file upload fails** — the 10MB limit is enforced in `src/utils/constants.ts`
(`MAX_FILE_SIZE`) and mirrored in the multer config; raise both if you need larger files, but note
Vercel serverless functions also cap request body size.

**Gemini response isn't valid JSON** — `aiService.ts` falls back to extracting the first `{...}`
block from the response; if that also fails, the raw text is returned under `data.raw` so the
request doesn't hard-fail.
