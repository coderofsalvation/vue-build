var fs = require('fs')
var projectRoot = process.cwd()
var merge = require('webpack-merge')

var config = {
  // Path to main source folder where your files reside
  context: projectRoot + '/src',
  // Main file entry point - must be in app object as we append dev injections to that path
  entry: {
    app: ['./app.js']
  },
  output: {
    path: projectRoot + '/dist',
    filename: '[name].js', // filename based upon entry variable - ex: app.js
    publicPath: '/' // Important for dev server main path
  },
  // Config information that will be sent to the dev server
  devServer: {
    // contentBase: './src', // Base path for the content
    port: 1234, // Dev server port
    hot: true, // Hot reloading
    historyApiFallback: true, // Enables suport for history api fallback
    clientLogLevel: 'warning', // The amount of logging for browser console logs
    noInfo: true // Suppress boring info in command line
  },
  resolve: {
    // If you dont put the extension on an import it will
    // try to resolve it by looking for these extensions first
    extensions: ['.scss', '.js', '.vue'],
    enforceExtension: false, // Whether or not to force user to add .ext to end of files
    // Aliases - Used for pointing to reusable parts of your app
    alias: {
      src: projectRoot + '/src'
    }
  },
  resolveLoader: {
    alias: {
      // This will allow you to do lang="scss" in your style tags
      'scss-loader': 'sass-loader'
    }
  },
  module: {
    rules: [
      // Preloaders
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        enforce: 'pre',
        test: /\.vue$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      // Loaders
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            postcss: [
              require('autoprefixer')({
                browsers: ['last 3 versions']
              })
            ]
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.(scss|css)$/,
        loaders: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[hash:7].[ext]'
        }
      }
    ]
  }
}

// If there is a webpack in the main project merge it
try {
  var webpackConfig = projectRoot + '/webpack.config.js'
  fs.statSync(webpackConfig)

  config = merge(config, require(webpackConfig))
} catch (err) {}

module.exports = config
