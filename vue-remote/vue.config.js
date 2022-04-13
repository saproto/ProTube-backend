const fs = require('fs');

module.exports = {
  publicPath: '/protube',
  outputDir: '../public/protube',
  pwa: {
    name: 'ProTube PWA',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    // configure the workbox plugin
    workboxPluginMode: 'GenerateSW'
  },
  devServer: {
    port:8080,
    allowedHosts: 'all'
  }
}
