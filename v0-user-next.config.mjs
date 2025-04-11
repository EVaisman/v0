/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Adjust this to your repository name (leave empty if deploying to username.github.io)
  basePath: process.env.NODE_ENV === 'production' ? '/personal-website' : '',
  images: {
    unoptimized: true, // Required for static export
  },
}

export default nextConfig
