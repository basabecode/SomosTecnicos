/** @type {import('next').NextConfig} */
const nextConfig = {
  // typescript: {
  //   ignoreBuildErrors: false,
  // },
  images: {
    unoptimized: false,
    qualities: [75, 90, 95],
  },
}

export default nextConfig
