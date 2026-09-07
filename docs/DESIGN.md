# Website conventions

The site helps Linux users install packages and find maintenance instructions.
VitePress's default theme owns typography, spacing, colors, navigation, code-copy controls,
search and responsive behavior. Use its home-page actions and documentation layout without
custom geometry or duplicated Vue components. Both modes retain upstream neutral colors.
The brand palette uses dark amber in light mode and soft gold in dark mode.
`theme/index.mjs` re-exports the default theme; `theme/brand.css` overrides only official
brand tokens and dark-mode brand-button text tokens. Dark text on gold buttons preserves
contrast. Keep layout, typography and component styles in the upstream theme.
The footer uses the official message option for a single Dae Universe and GitHub line;
package licenses remain in the package reference.
The header follows the official layout: language, appearance and social controls remain on
the right at desktop widths, with the default theme's responsive menus on narrower screens.
Do not reorder these controls through CSS, transformed components or replacement navigation.

## Brand asset

`public/daeuniverse-hero.png` is the color goose illustration used through the default
homepage `hero.image` option. `public/daeuniverse.png` is its grayscale version for the
navigation logo; `public/daeuniverse-favicon.png` is a 64px favicon derived from it.
All three are transparent PNGs derived from the user-provided 640px image
`photo_2023-03-26_06-49-49.jpg`. Background removal cleans yellow edge spill while
retaining the yellow beak and white feather fills. These replace the lower-resolution
GitHub avatar; no generated redraw or custom image-layout CSS is used.
The artwork identifies daeuniverse; no separate image license is asserted.

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
`.vitepress/upstream.json`. Each page ends with links to its pinned source and the copied AGPL license.
The original network-stack illustration is copied into `public/upstream/`. A derived
`netstack-path-dark.png` brightens dark labels and lines for dark mode. Three image
visibility rules follow the theme class; the diagram is not globally inverted or placed
on a white panel. Both variants retain the same diagram layout.

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
`/repo-for-linux/`), `DOCS_CLEAN_URLS=false`, and `DOCS_SITE_URL` to the full Pages URL,
including the repository path and a trailing slash. Sitemap URLs resolve against this URL.
The default build still targets the upstream root-domain site. Publish the preview output
with `.nojekyll`; it contains documentation only, while installation commands keep using
upstream package repository URLs.

## Documentation CI

`.github/workflows/docs.yml` checks relevant pushes and pull requests with `npm ci`,
`npm run docs:test` and a production build, then uploads a downloadable preview artifact.
The existing package-repository workflow also tests and builds the documentation before
combining it with the package repository artifact.

GitHub Pages deployment is opt-in: set the repository variable `DOCS_PAGES_PREVIEW=true`
and select GitHub Actions as the Pages source. `DOCS_PAGES_BRANCH` selects the publishing
branch; when omitted, the repository default branch is used. Allow that branch in the
`github-pages` environment's deployment policy. The workflow obtains the actual Pages
full site URL and base path from `actions/configure-pages` and builds with explicit `.html` URLs.
Only successful checks on the selected branch can deploy; pull requests cannot deploy.
The build jobs have read permissions, and only the deployment job receives Pages write
and OIDC permissions. Repositories without the opt-in variable keep checks and artifacts.

## Document presentation

APT and RPM alternatives use native code groups, keeping commands unchanged. Installation
commands provide sudo and root tabs; their only difference is the leading sudo prefix.
Use sudo tabs only when sudo is configured. Gentoo
prerequisites and existing-overlay advice use native callouts; optional mirror information
uses a details block. Its community-maintained badge describes ownership, not stability.

The official edit-link option points to upstream main by default. `DOCS_EDIT_URL` can
provide a preview repository URL containing `:path`; the Pages build sets it from the
repository and publishing branch. Last-updated dates come from Git history. Build checkouts
need full history so dates reflect file commits rather than a shallow checkout boundary.
