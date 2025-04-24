// next.config.js
// const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/processImage',
        destination: 'http://3.148.185.190:5001/processImage',
      },
      {
        source: '/getProcessedImage',
        destination: 'http://3.148.185.190:5001/getProcessedImage',
      },
    ]
  },
  // Optional: Configure headers if needed
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,PATCH,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ]
  },
}
