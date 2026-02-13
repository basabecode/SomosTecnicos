/** @type {import('next').NextConfig} */
const nextConfig = {
  // typescript: {
  //   ignoreBuildErrors: false,
  // },
  images: {
    unoptimized: true,
    qualities: [75, 90, 95],
  },
}

export default nextConfig
