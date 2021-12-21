console.log('This is build by mobile.')
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/p' : '/p',
  outputDir: './dist/p',
  pages: {
    'index': {
      entry: 'src/pages/index.js',
      template: 'src/pages/index.html',
      filename: 'index.html',
    },
    'callback': {
      entry: 'src/pages/callback.js',
      template: 'src/pages/callback.html',
      filename: 'callback/index.html',
    }
  },
  devServer: {
    // contentBase: path.join(__dirname, "public"),
    public: 'http://localhost:8080',
    publicPath: 'http://localhost:8080/p',
    port: 8080,
    host: '0.0.0.0',
    hot: true,
    inline: false,
    disableHostCheck: true,
    https: false,
    hotOnly: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    },
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000,
    }
  },
  // configureWebpack: config => {
  //   if (process.env.NODE_ENV === 'production') {
  //     config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
  //     config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
  //     config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
  //     config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
  //   }
  //   config.resolve = {
  //     extensions: ['.js', '.json', '.vue', '.scss', '.css'],
  //     alias: {},
  //   }
  //   config['externals'] = {}
  // },
  chainWebpack: options => {
    options.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/pages/index.js')
    })
    options.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/pages/index.js')
    })
  }
}