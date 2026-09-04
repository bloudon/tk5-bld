---
name: Wouter Switch route children
description: SSR routing constraint for generated routes placed inside a Wouter Switch.
---

Generated `Route` elements must remain direct children of `Switch`; do not hide the route collection behind a wrapper component or fragment child.

**Why:** A wrapper without its own path can be treated as the first pathless/default child. During prerendering, routes listed after it can render no page body even though type checking and the generated-route pages themselves look correct.

**How to apply:** When adding data-driven route inventories to a Wouter `Switch`, map the `Route` elements inline as direct children and verify a known route declared after the generated collection in raw SSR HTML.