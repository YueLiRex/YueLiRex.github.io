---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Yue's Tech Notes"
  text: "Rust, Scala, Java, data engineering, and the Kubernetes plumbing in between."
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
