# GAIR website redesign

An implementation of the GAIR website information-architecture proposal.
The redesign keeps the public content and media from `GAIR-NLP/lab-site`, then
organizes it around six user-facing tasks: Research, People, Resources,
Updates, Join and the external GitHub organization.

## What changed

- A substantive homepage with research areas, featured work, explicit asset
  links, selected papers, people, updates and recruiting paths.
- A searchable, role-filterable People directory with AI systems separated
  from human members and alumni.
- A complete Contact / Join page using the existing four authoritative briefs
  and forms, with all placeholder copy removed.
- Shared responsive navigation and restrained visual styling across the
  preserved Research, News, Teaching, Activities and archive pages.
- No build step or framework dependency; the repository deploys directly to
  GitHub Pages.

## Local preview

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Content provenance

Text, project links, member roles and media are based on the public GAIR site
snapshot retrieved from `GAIR-NLP/lab-site` on 2026-09-06. Role descriptions
and external links should continue to be reviewed by GAIR content owners.
