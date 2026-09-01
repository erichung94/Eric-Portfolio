# Eric Hung — Portfolio Site (erichung.dev)

Single-page Astro site with two modes: Developer (default, light) and Dancer (dark).
One layout, shared design system, content + theme swap driven by `<html data-mode>`.

## Context (from the EricAssistant workspace)

@../../EricAssistant/context/me.md
@../../EricAssistant/.claude/rules/communication-style.md

## Design source of truth

Spec: `../../EricAssistant/projects/portfolio-site/spec.md`
Plan: `../../EricAssistant/projects/portfolio-site/plan.md`

## Rules

- Static only. No backend. Contact and booking are mailto links.
- React is allowed in `src/components/ModeSwitch.tsx` only. Everything else is `.astro`.
- Both routes must render correct content and theme with JavaScript disabled.
- `npm run check` must pass before every commit.
- Blue accent is the through-line: sky in light mode, navy in dark mode.
