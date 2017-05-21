var webpackConfig = require("./webpack.config")
var webpack = require("webpack")

webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
        comments: false,
        compress: {
            drop_console: true
        }
    })
)

module.exports = webpackConfig;