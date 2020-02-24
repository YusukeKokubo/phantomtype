module.exports = {
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/kyoto': { page: '/city/kyoto' },
      '/nagoya': { page: '/city/nagoya' },
      '/matsushima': { page: '/city/matsushima' },
      '/kanazawa': { page: '/city/kanazawa' },
      '/pic/[id]': { page: '/pic/[id]' }
    }
  },
  exportTrailingSlash: true
}
