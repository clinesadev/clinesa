import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias['@prisma-generated'] = path.resolve(__dirname, 'generated/prisma')
    return config
  },
}

export default nextConfig
