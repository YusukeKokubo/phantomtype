module.exports = {
  images: {
    deviceSizes: [320, 420, 768, 1024, 1200, 1400, 1680, 1800, 2400]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    return config
  }
}
