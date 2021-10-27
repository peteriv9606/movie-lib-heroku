const APIURL = process.env.APIURL || "http://localhost:4000"

module.exports = {
  reactStrictMode: true,
  env: {
    apiUrl: `${APIURL}/api/`,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  }
}
