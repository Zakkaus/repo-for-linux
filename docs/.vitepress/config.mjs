import { defineConfig } from 'vitepress'
import { locales } from './locales.mjs'
import upstream from './upstream.json' with { type: 'json' }

const repositoryUrl = 'https://github.com/daeuniverse/repo-for-linux'
const base = process.env.DOCS_BASE || '/'

function pageLocale(relativePath) {
  return Object.values(locales).find(locale => locale.prefix &&
    relativePath.startsWith(locale.prefix.slice(1) + '/')) || locales.root
}

function localeConfig({ lang, label, prefix, description, labels: t, theme }) {
  const pages = upstream.entries.filter(entry => entry.locale === lang)
  const manualItems = section => pages
    .filter(entry => section ? entry.topic.startsWith(`${section}/`) : !entry.topic.includes('/'))
    .map(entry => ({ text: entry.title, link: `/${entry.path.replace(/\.md$/, '').replace(/\/index$/, '/')}` }))
  return {
    lang, label, description,
    link: `${prefix}/`,
    themeConfig: {
      ...theme,
      editLink: { text: t.edit, pattern: process.env.DOCS_EDIT_URL || `${repositoryUrl}/edit/main/docs/:path` },
      nav: [
        { text: t.manual, link: `${prefix}/manual/` },
        { text: t.development, link: `${prefix}/manual/development/contribute` }
      ],
      sidebar: [
        { text: t.manual, items: manualItems('') },
        { text: t.installation, items: [
          { text: t.debian, link: `${prefix}/guide/debian` },
          { text: t.rpm, link: `${prefix}/guide/rpm` },
          { text: t.gentoo, link: `${prefix}/guide/gentoo` }
        ] },
        { text: t.tutorials, collapsed: false, items: manualItems('tutorials') },
        { text: t.userGuide, collapsed: false, items: manualItems('user-guide') },
        { text: t.configuration, collapsed: false, items: manualItems('configuration') },
        { text: t.development, collapsed: false, items: manualItems('development') },
        { text: t.reference, items: [
          { text: t.available, link: `${prefix}/guide/packages` },
          { text: t.gentoo, link: `${prefix}/guide/packages/gentoo` },
          { text: t.services, link: `${prefix}/guide/maintenance` }
        ] }
      ],
      outline: { level: [2, 3], label: t.outline },
      docFooter: { prev: t.previous, next: t.next }
    }
  }
}

export default defineConfig({
  title: 'Dae Universe',
  lastUpdated: true,
  base,
  head: [['link', { rel: 'icon', type: 'image/png', href: `${base}daeuniverse-favicon.png` }]],
  cleanUrls: process.env.DOCS_CLEAN_URLS !== 'false',
  appearance: true,
  srcExclude: ['DESIGN.md'],
  outDir: process.env.DOCS_OUT_DIR || './.vitepress/dist',
  cacheDir: process.env.DOCS_CACHE_DIR || './.vitepress/cache',
  sitemap: { hostname: process.env.DOCS_SITE_URL || 'https://daeuniverse.pages.dev' },
  locales: Object.fromEntries(Object.entries(locales).map(([key, locale]) => [key, localeConfig(locale)])),
  markdown: {
    config(md) {
      const fence = md.renderer.rules.fence
      md.renderer.rules.fence = (tokens, index, options, env, renderer) => {
        const title = md.utils.escapeHtml(pageLocale(env.relativePath || '').labels.copy)
        return fence(tokens, index, options, env, renderer).replace('title="Copy Code"', `title="${title}"`)
      }
      const linkOpen = md.renderer.rules.link_open
      md.renderer.rules.link_open = (tokens, index, options, env, renderer) => {
        const html = linkOpen ? linkOpen(tokens, index, options, env, renderer) : renderer.renderToken(tokens, index, options)
        const label = md.utils.escapeHtml(pageLocale(env.relativePath || '').labels.permalink)
        return html.replace('aria-label="Permalink to ', `aria-label="${label} `)
      }
    }
  },
  transformHead({ pageData }) {
    const { copied } = pageLocale(pageData.relativePath).labels
    return [['style', {}, `:root { --vp-code-copy-copied-text-content: ${JSON.stringify(copied)}; }`]]
  },
  themeConfig: {
    siteTitle: 'Dae Universe',
    footer: { message: `Dae Universe · <a href="${repositoryUrl}">GitHub</a>` },
    logo: { src: '/daeuniverse.png', alt: 'Dae Universe' },
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            tokenize: (text) => Array.from(new Intl.Segmenter('en', { granularity: 'word' }).segment(text))
              .filter(segment => segment.isWordLike).map(segment => segment.segment)
          }
        },
        locales: Object.fromEntries(Object.entries(locales)
          .filter(([, locale]) => locale.search)
          .map(([key, locale]) => [key, { translations: locale.search }]))
      }
    },
    socialLinks: [{ icon: 'github', link: repositoryUrl }]
  }
})
