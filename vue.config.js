module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        // @是已经配置好了的，为src
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views'
      }
    }
  }
}