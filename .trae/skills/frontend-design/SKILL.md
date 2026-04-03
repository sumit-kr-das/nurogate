---
name: "frontend-design"
description: "Designs modern SaaS UIs using this repo’s React + Tailwind + shadcn patterns. Invoke when user asks for landing/pricing/auth UI polish or brand-level visual upgrades."
---

# Frontend Design (SaaS UI)

Use this skill to create or refine “modern, professional SaaS” pages in the dashboard app.

## Target Stack (Repo Conventions)

- React (SPA) with React Router
- TailwindCSS (v4) + shadcn/ui components in `src/components/ui/*`
- Icons via `lucide-react`
- Prefer existing primitives (`Button`, `Card`, `Input`) over custom styling when possible
- Do not introduce new libraries unless they already exist in `apps/dashboard/package.json`

## Visual Style Guidelines

- Dark-first aesthetic with subtle gradients and glassy surfaces
- Use layered depth:
  - background: radial gradients (very low opacity)
  - surfaces: `bg-card/40 backdrop-blur border-border/70`
  - separators: `border-border/60`
- Typography:
  - hero: `text-4xl sm:text-5xl` + `tracking-tight` + `text-balance`
  - supporting: muted foreground, short lines (`max-w-*`)
- Layout:
  - max container: `max-w-6xl` and consistent `px-6`
  - section rhythm: `pb-20` blocks with clear headings
  - include a strong CTA and a multi-column footer

## UX Guidelines

- Navigation:
  - include Pricing, Login, Register
  - use sticky or top nav with subtle blur for “SaaS” feel
- Landing page should include:
  - hero + product proof
  - “How it works”
  - feature cards
  - testimonials / social proof
  - FAQ
  - final CTA
  - polished footer with newsletter block

## Implementation Checklist

- Keep routes stable (`/`, `/pricing`, `/login`, `/register`)
- Ensure icons are imported and used consistently
- Ensure all links are `Link` from `react-router`
- Run lint + typecheck after UI changes
