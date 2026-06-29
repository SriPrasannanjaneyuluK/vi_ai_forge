# VJ AI Forge — User Portal

Public marketing site + **student & teacher** portal (`academy.com` in production).

| Route | Purpose |
|-------|---------|
| `/` | Public homepage (courses, learnings, contact) |
| `/login` | Student & teacher sign-in |
| `/dashboard` | Role-based dashboard after login |

Admins use the **separate** app in `vi_ai_forge_admin` (`admin.academy.com` / `http://localhost:5174`).

## Edit website copy (no deploy to admin)

All marketing text lives in **`src/lib/constants.ts`** — academy name, nav labels, section headings, founder bio, team, testimonials, stats, CTA, and contact copy. Change that file and refresh the site.

**From the API / database (admin-managed):**

- Published **courses** catalog
- **Featured course** on the homepage hero (when a course is published with “feature on homepage”)

## Local development

Run all three services:

```bash
# Terminal 1 — API
cd ../vi_ai_forge_api && npm run dev    # :3001

# Terminal 2 — User portal (this app)
npm install && npm run dev              # :5173

# Terminal 3 — Admin portal
cd ../vi_ai_forge_admin && npm run dev  # :5174
```

Copy `.env.example` to `.env`:

```
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Architecture

```
academy.com (vi_ai_forge)             →  Public site + student/teacher portal
admin.academy.com (vi_ai_forge_admin) →  Courses + user access management
              \________________________/
                          |
                  vi_ai_forge_api :3001
                          |
                       Supabase
```

## Tech stack

React 19 · Vite 7 · TypeScript · Tailwind CSS v4 · Framer Motion · Supabase Auth
