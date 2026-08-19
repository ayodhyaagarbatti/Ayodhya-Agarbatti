import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { pathToFileURL } from 'url'

// Serves api/create-order.js and api/verify-payment.js under Vite's dev server,
// so `npm run dev` behaves like Vercel's /api serverless functions in production
// without needing a second process or the Vercel CLI. The api/*.js files are
// plain ESM modules (export default handler) - the query string cache-busts
// Node's ESM module cache so edits to them are picked up without restarting.
const razorpayApiDevPlugin = (env) => ({
  name: 'razorpay-api-dev-middleware',
  configureServer(server) {
    Object.assign(process.env, env)
    const routes = {
      '/api/create-order': path.resolve(process.cwd(), 'api/create-order.js'),
      '/api/verify-payment': path.resolve(process.cwd(), 'api/verify-payment.js'),
    }
    for (const [route, modulePath] of Object.entries(routes)) {
      server.middlewares.use(route, async (req, res) => {
        try {
          const url = `${pathToFileURL(modulePath).href}?update=${Date.now()}`
          const { default: handler } = await import(/* @vite-ignore */ url)
          await handler(req, res)
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message || 'Dev API handler failed' }))
        }
      })
    }
  },
})

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), razorpayApiDevPlugin(env)],
  }
})
