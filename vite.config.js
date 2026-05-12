import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

// GitHub Pages serves 404.html for unknown routes.
// Copying index.html → 404.html so the SPA router can handle deep links like /admin.
function ghPages404() {
  return {
    name: 'gh-pages-spa-404',
    closeBundle() {
      const outDir = path.resolve('dist')
      const src = path.join(outDir, 'index.html')
      const dst = path.join(outDir, '404.html')
      if (fs.existsSync(src)) fs.copyFileSync(src, dst)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), ghPages404()],
  base: '/',
})
