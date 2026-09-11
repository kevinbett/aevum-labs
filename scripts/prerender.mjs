// Prerender the React SPA to static HTML at build time so AI crawlers and
// no-JS readers get the full page, not an empty <div id="root">. Pure Node +
// react-dom/server (no headless browser) so it runs anywhere Vercel builds.
// Humans still get the client render — main.jsx's createRoot() replaces this
// markup on mount, so the two never conflict.
import { build } from 'esbuild'
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const dir = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(dir, '..')
const tmp = path.join(dir, '.prerender-bundle.mjs')

const entry = `
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import App from ${JSON.stringify(path.join(root, 'src/App.jsx'))}
export const html = renderToStaticMarkup(React.createElement(App))
`

await build({
  stdin: { contents: entry, resolveDir: root, loader: 'js' },
  bundle: true,
  format: 'esm',
  platform: 'node',
  jsx: 'automatic',
  packages: 'external', // let Node resolve react/react-dom natively (they require() node builtins)
  outfile: tmp,
  logLevel: 'error',
})

const { html } = await import(`${tmp}?t=${Date.now()}`)
rmSync(tmp, { force: true })

const indexPath = path.join(root, 'dist/index.html')
const doc = readFileSync(indexPath, 'utf8')
const marker = '<div id="root"></div>'
if (!doc.includes(marker)) throw new Error('prerender: could not find empty root div in dist/index.html')
writeFileSync(indexPath, doc.replace(marker, `<div id="root">${html}</div>`))
console.log(`prerender: injected ${html.length.toLocaleString()} chars of static markup into dist/index.html`)
