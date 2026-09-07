# Website conventions

The site helps Linux users install packages and find maintenance instructions.
VitePress's default theme owns typography, spacing, colors, navigation, code-copy controls,
search and responsive behavior. Use its home-page actions and documentation layout without
custom geometry or duplicated Vue components. Both light and dark themes use upstream defaults.
The header follows the official layout: language, appearance and social controls remain on
the right at desktop widths, with the default theme's responsive menus on narrower screens.
Do not reorder these controls through CSS, transformed components or replacement navigation.

## Brand asset

`public/daeuniverse.jpg` is the unmodified GitHub organization avatar from
https://avatars.githubusercontent.com/u/126714249?v=4&s=256 (retrieved 2026-09-07).
It is served locally as the navigation logo and favicon in every locale and theme.
The asset identifies daeuniverse; no separate image license is asserted.

## Content and languages

English lives in `docs/`, Simplified Chinese in `docs/zh-CN/`, and Traditional Chinese in
`docs/zh-TW/`. Each language has an `index.md` home page and matching `guide/` and `manual/` documents.
Edit these Markdown files directly. The upstream language menu preserves the current document
when switching languages. Keep commands and package identities consistent across translations.

`docs/.vitepress/locales.mjs` is the locale registry. Adjacent `locales/*.ui.json` files contain
navigation, search and accessibility labels. Markdown render hooks translate copy buttons and
heading-link labels; VitePress's text token controls translated copy feedback.
Use documented theme options and Markdown hooks; do not transform VitePress's internal Vue
components. The pinned release's hidden sidebar landmark heading keeps its upstream English
text because this release exposes no translation option for it.

## Upstream manual

`manual/` contains the complete topic union of upstream `docs/en/` and `docs/zh/`.
English is the canonical source for shared topics; the Chinese-only refactoring validation
plan uses the Chinese source. Both Chinese locales have independently authored translations.
The upstream revision, original paths, source hashes and fenced-code hashes are recorded in
`.vitepress/upstream.json`. Each page links to its pinned source and the copied AGPL license.
The network-stack illustration is copied into `public/upstream/`.

These are attributed upstream documents, including historical examples. They are separate
from this repository's APT/RPM installation instructions. Preserve their conditions and code;
do not silently modernize versions, replace commands or present recorded upstream test results
as validation performed for this site. Internal documentation links use the matching locale.
The native language control replaces redundant language links inside upstream prose.
Markdown wrappers use `v-pre` to keep upstream examples from becoming Vue expressions.

The homepage exposes installation, usage, configuration, platform tutorials, packages and
development. The sidebar derives manual page titles and routes from the same manifest, so
imported pages cannot silently fall outside the navigation inventory.

The home hero has a primary Quick start action and a secondary Browse packages action. APT, RPM and Gentoo installation
remain in the native sidebar. The top navigation contains only Guide and Development;
configuration and package links remain available through the sidebar and home features. Gentoo's dae package comes from the
independently maintained gentoo-zh overlay; its versions are not represented by the APT/RPM table.
The Gentoo guide references https://gentoozh.org/overlay/ and the overlay's net-proxy/dae ebuild.

Only the APT/RPM package rows are generated from README.md. `npm run docs:prepare` writes a
shared Markdown fragment under `.vitepress/generated/`, included by the three package reference
pages using VitePress's Markdown include syntax. Each reference owns its translated table header.
The existing package-table script remains the source of version data. README installation prose
is maintained separately; checks enforce that its shell commands remain represented in the docs.

## Build and preview

Use Node.js 22 or newer. Run `npm ci`, then `npm run docs:dev`.
Run `npm run docs:test` for command and locale parity checks, `npm run docs:build` for production
output, and `npm run docs:preview` to inspect it. Markdown changes reload during development;
rerun preparation when package metadata changes.
`DOCS_OUT_DIR` and `DOCS_CACHE_DIR` can place build output and cache outside the checkout.

Build the website separately, then copy its output into the existing repository artifact.
Never clean the package repository directory as part of a website build. Preserve the URLs
for apt, rpm, public keys and repository configuration files.

Before release, inspect all routes at desktop and mobile widths in both themes, keyboard
navigation, language switching, local search and code copying. A production build alone does
not verify these interactions.

For a GitHub project Pages preview, set `DOCS_BASE` to the repository path (for example,
`/repo-for-linux/`), `DOCS_CLEAN_URLS=false`, and `DOCS_SITE_URL` to the Pages origin.
The default build still targets the upstream root-domain site. Publish the preview output
with `.nojekyll`; it contains documentation only, while installation commands keep using
upstream package repository URLs.
