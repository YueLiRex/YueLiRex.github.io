# Home page layout redesign

**Date:** 2026-08-10
**Status:** Approved

## Problem

`articles/index.md` is unmodified VitePress scaffolding. The hero reads "Welcome to
/ My tech notes site", and the three feature cards are one real project
(`alpaca-trade-api-rust`) plus two `Lorem ipsum` placeholders. The page says nothing
about what the site is or what is on it.

The constraint shaping this design: the site has **one** genuinely written article
(`devops/cross-namespace-configuration-sharing-in-kubernetes/Cross-Namespace.md`).
`rust/rust-ownership-explained.md`, `articles.md`, and `who-am-i.md` are VitePress
template text; the two `data-engineering/` articles are 0-byte files. Any home page
built around "latest posts" would surface mostly stubs.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Card content | Topic areas, not posts or projects | Stays accurate as content grows; a topic card never looks empty the way a post card does |
| Card targets | New per-section index pages | `/rust` etc. currently 404 — VitePress does not generate directory indexes |
| Hero voice | Topic-forward, role-neutral | Describes subject matter without asserting a job title |
| `articles.md` | Rebuild as grouped index | The hero's primary CTA points at it; today it is the markdown-extensions demo |
| Hero gradient | Skipped | Would require `.vitepress/theme/` — the repo's first custom theme code, for cosmetics only |

## Scope

Six files change, three of them new.

### 1. `articles/index.md` — rewrite frontmatter

Keeps `layout: home`. Entire `hero` and `features` blocks replaced.

```yaml
---
layout: home

hero:
  name: "Yue's Tech Notes"
  text: "Rust, data engineering, and the Kubernetes plumbing in between."
  tagline: Working notes on what I'm learning — written down so I remember it, shared in case it helps you too.
  actions:
    - theme: brand
      text: Read the notes
      link: /articles
    - theme: alt
      text: Who am I?
      link: /who-am-i

features:
  - icon: 🦀
    title: Rust
    details: Ownership, lifetimes, and the borrow checker — worked through until they stopped being scary.
    link: /rust/
    linkText: Read Rust notes
  - icon: 🧊
    title: Data Engineering
    details: Lakehouse table formats — Iceberg, Hudi, and how they actually behave under load.
    link: /data-engineering/
    linkText: Read data notes
  - icon: ☸️
    title: DevOps
    details: Kubernetes in practice — config, namespaces, and the plumbing nobody documents.
    link: /devops/
    linkText: Read DevOps notes
---
```

`alpaca-trade-api-rust` loses its only link on the site. Accepted: it belongs in
`who-am-i.md`, which is out of scope here. Noted as follow-up.

### 2–4. Three new section index pages

Each is `layout: doc`, an H1, a one-sentence intro matching its card, and a
hand-maintained list of that section's articles.

**`articles/rust/index.md`** → `/rust/`
- Intro: ownership, lifetimes, borrow checker
- Lists: Everything about Rust ownership → `/rust/rust-ownership-explained`

**`articles/data-engineering/index.md`** → `/data-engineering/`
- Intro: lakehouse table formats
- Lists: Introduce to Apache Iceberg → `/data-engineering/apache-iceberg-introduction/apache-iceberg-introduction`
- Lists: Apache Hudi 101 → `/data-engineering/apache-hudi-101/apache-hudi-101`

**`articles/devops/index.md`** → `/devops/`
- Intro: Kubernetes config and cluster plumbing
- Lists: Cross namespace configuration sharing in kubernetes → `/devops/cross-namespace-configuration-sharing-in-kubernetes/Cross-Namespace`

Known thin state: the Rust index lists one placeholder article, and the Data
Engineering index lists two 0-byte files. The pages are structurally correct and
will fill in as content is written. Entries are **not** annotated as drafts —
adding and removing such markers is churn.

### 5. `articles/articles.md` — rebuild as grouped index

Discard the markdown-extensions demo. Replace with `layout: doc`, an H1, and the
same three groups as the sidebar, each an H2 over a bullet list linking every
article. This is a flat mirror of the section indexes; it exists because the nav
and the hero CTA both point here.

### 6. `articles/.vitepress/config.mts` — sidebar entries

Per `CLAUDE.md`, a file not present in the `sidebar` array is unreachable. Add an
`Overview` item as the first entry of each of the three existing sections:

- Rust → `/rust/`
- Data Engineering → `/data-engineering/`
- Devops → `/devops/`

Existing article entries and their order are unchanged. `nav` is unchanged.

## Out of scope

`who-am-i.md`, the article bodies, `.github/workflows/deploy.yml`, and any custom
theme or CSS. All remain as they are.

## Verification

1. `pnpm articles:build` completes without error.
2. `pnpm articles:dev`, then confirm by navigation: each of the three home cards
   loads its section index rather than a 404; both hero buttons resolve; every
   bullet on `/articles` and on each section index resolves to its article.

Trailing-slash links (`/rust/`) resolving to `rust/index.md` is the specific risk
worth checking in step 2 — a wrong path here fails as a 404 at runtime, not as a
build error.

## Follow-ups (not this change)

- Write real content for the two 0-byte `data-engineering/` articles
- Replace `rust/rust-ownership-explained.md` template text
- Rewrite `who-am-i.md`, and give `alpaca-trade-api-rust` a home there
