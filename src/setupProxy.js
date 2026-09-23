// Create React App loads this file automatically in `npm start` (dev only).
//
// Internet Archive files are served without CORS or a Content-Disposition
// header, so a plain link just plays the video in a new tab. Routing the
// download through the dev server lets us add `Content-Disposition: attachment`,
// which makes the browser save the file instead.
const { createProxyMiddleware } = require('http-proxy-middleware')

// Only /archive-download/<identifier>/<video file> is forwarded, so this can't
// be used as an open proxy to other sites or file types.
const ALLOWED = /^\/archive-download\/[A-Za-z0-9._-]+\/[^?#]+\.(mp4|ogv|mpeg|mpg|mkv|avi)$/i

module.exports = function (app) {
  app.use('/archive-download', (req, res, next) => {
    if (!ALLOWED.test(req.originalUrl.split('?')[0])) {
      res.status(400).send('Download not allowed')
      return
    }
    next()
  })

  app.use(
    createProxyMiddleware('/archive-download', {
      target: 'https://archive.org',
      changeOrigin: true,
      // archive.org/download/... redirects to the server that holds the file
      followRedirects: true,
      pathRewrite: { '^/archive-download': '/download' },
      onProxyRes(proxyRes, req) {
        const fileName = decodeURIComponent(req.originalUrl.split('?')[0].split('/').pop())
        proxyRes.headers['content-disposition'] =
          `attachment; filename="${fileName.replace(/["\\\r\n]/g, '')}"`
      },
    })
  )
}
