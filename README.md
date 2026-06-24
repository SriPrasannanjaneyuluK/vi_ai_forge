# VJ AI Forge

An animated learning playground landing page for **VJ AI Forge** — where people learn software skills through courses, labs, mock tests, and community.

Built with **React + Vite**, Tailwind CSS v4, and Framer Motion.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build for Production

```bash
npm run build
npm run preview
```

## Customize Content

All editable copy lives in [`src/lib/constants.ts`](src/lib/constants.ts):

- Academy name, tagline, and caption
- Course list and latest course spotlight
- Founder bio, experience, and team members
- Stats, testimonials, and community posts

## Add Images

- **Founder photo:** Place `founder.jpg` in the `public/` folder and update the Founder section to use it.
- **Team photos:** Add images to `public/team/` and reference them in `src/lib/constants.ts`.

## Tech Stack

- React 19
- Vite 7
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide React icons

## Deploy

Build the `dist/` folder and deploy to Netlify, Vercel, GitHub Pages, or any static host.

## Phase 2 (Coming Soon)

- Real authentication (Login)
- Community portal
- Interactive labs backend
- Waitlist API integration
