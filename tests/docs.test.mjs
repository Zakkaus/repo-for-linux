import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { locales } from '../docs/.vitepress/locales.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const commands = text => [...text.matchAll(/```(?:sh|text)\n([\s\S]*?)```/g)].map(match => match[1])

function fencedCodeHashes(text) {
  const hashes = []
  let fence, block = ''
  for (const line of text.match(/[^\n]*\n|[^\n]+$/g) || []) {
    const marker = line.trimEnd().match(/^\s*(`{3,}|~{3,})(.*)$/)
    if (!fence) {
      if (marker) { fence = marker[1]; block = line }
    } else {
      block += line
      if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim()) {
        hashes.push(createHash('sha256').update(block.replace(/\n$/, '')).digest('hex'))
        fence = undefined
      }
    }
  }
  assert.equal(fence, undefined, 'Unclosed code fence')
  return hashes
}

function requiredKeys(source, target, path = '') {
  for (const [key, value] of Object.entries(source)) {
    assert.ok(Object.hasOwn(target, key), `Missing message: ${path}${key}`)
    if (value && typeof value === 'object') requiredKeys(value, target[key], `${path}${key}.`)
  }
}

test('translated documents preserve routes, commands and required messages', async () => {
  const pages = (await readdir(join(root, 'docs/guide'))).filter(name => name.endsWith('.md')).sort()
  const sourceCommands = []
  for (const page of pages) sourceCommands.push(...commands(await readFile(join(root, 'docs/guide', page), 'utf8')))
  for (const command of commands(await readFile(join(root, 'README.md'), 'utf8'))) {
    assert.ok(sourceCommands.includes(command), `README command missing from docs: ${command}`)
  }
  for (const locale of Object.values(locales)) {
    requiredKeys(locales.root.labels, locale.labels)
    if (!locale.prefix) continue
    const directory = join(root, `docs${locale.prefix}`)
    assert.deepEqual((await readdir(join(directory, 'guide'))).filter(name => name.endsWith('.md')).sort(), pages)
    for (const page of pages) {
      const source = await readFile(join(root, 'docs/guide', page), 'utf8')
      const translated = await readFile(join(directory, 'guide', page), 'utf8')
      assert.deepEqual(commands(translated), commands(source), `${locale.lang}/${page}`)
    }
    const home = await readFile(join(directory, 'index.md'), 'utf8')
    assert.ok(home.includes(`${locale.prefix}/manual/`), `${locale.lang}: missing quick-start entry`)
  }
})

test('all package references include the same generated data; malformed data fails', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'dae-docs-'))
  try {
    for (const path of ['README.md', 'scripts/prepare-docs.mjs']) {
      await cp(join(root, path), join(directory, path), { recursive: true })
    }
    const prepare = () => execFileSync(process.execPath, ['scripts/prepare-docs.mjs'], { cwd: directory, stdio: 'pipe' })
    prepare()
    const rows = await readFile(join(directory, 'docs/.vitepress/generated/package-rows.md'), 'utf8')
    const readme = await readFile(join(directory, 'README.md'), 'utf8')
    assert.ok(readme.includes(rows.trim()))
    for (const locale of Object.values(locales)) {
      const page = await readFile(join(root, `docs${locale.prefix}/guide/packages.md`), 'utf8')
      assert.match(page, /<!--@include: (?:\.\.\/)+\.vitepress\/generated\/package-rows\.md-->/)
    }
    await writeFile(join(directory, 'README.md'), readme.replace('<!-- END GENERATED PACKAGE TABLE -->', ''))
    assert.throws(prepare, error => /markers are missing/.test(error.stderr.toString()))
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('every upstream topic exists in every locale and retains its original examples', async () => {
  const manifest = JSON.parse(await readFile(join(root, 'docs/.vitepress/upstream.json'), 'utf8'))
  assert.match(manifest.revision, /^[a-f0-9]{40}$/)
  const topics = manifest.entries.filter(entry => entry.locale === locales.root.lang).map(entry => entry.topic).sort()
  assert.equal(topics.length, 21, 'Pinned upstream snapshot contains 21 distinct topics')
  assert.equal(new Set(topics).size, topics.length)
  assert.ok(topics.includes('development/refactor-validation-plan.md'))
  for (const locale of Object.values(locales)) {
    const entries = manifest.entries.filter(entry => entry.locale === locale.lang)
    assert.deepEqual(entries.map(entry => entry.topic).sort(), topics)
    for (const entry of entries) {
      const page = await readFile(join(root, 'docs', entry.path), 'utf8')
      assert.equal(entry.fallback, false, `${entry.path} still uses a fallback language`)
      assert.ok(page.includes(`lang="${locale.lang}"`), entry.path)
      assert.ok(page.includes(`/blob/${manifest.revision}/${entry.source}`), entry.path)
      assert.deepEqual(fencedCodeHashes(page), entry.sourceCodeSha256, `${entry.path}: upstream code changed`)
      assert.ok((page.match(/^#{1,6} /gm) || []).length >= entry.sourceHeadingCount, `${entry.path}: missing sections`)
    }
  }
})
