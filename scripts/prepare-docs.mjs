import { readFile, mkdir, writeFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const readme = await readFile(new URL('README.md', root), 'utf8')
const table = readme.match(/<!-- BEGIN GENERATED PACKAGE TABLE -->\s*([\s\S]*?)\s*<!-- END GENERATED PACKAGE TABLE -->/)
if (!table) throw new Error('README package table markers are missing')
const lines = table[1].trim().split('\n')
if (lines[0] !== '| Software | Version | Project | License |' || !/^\|(?:\s*---\s*\|){4}$/.test(lines[1])) {
  throw new Error('Unexpected README package table format')
}
const rows = lines.slice(2)
if (!rows.length || rows.some(row => !row.startsWith('|') || row.split('|').length !== 6)) {
  throw new Error('Package table contains missing or malformed rows')
}
const directory = new URL('docs/.vitepress/generated/', root)
await mkdir(directory, { recursive: true })
await writeFile(new URL('package-rows.md', directory), rows.join('\n') + '\n')
console.log(`Prepared ${rows.length} package rows shared by all documentation locales`)
