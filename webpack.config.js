var path = require('path')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
    context: path.resolve("public"),
    entry: {
        "login/bundle": './js/login/app',
        "index/bundle": "./js/index/app",
    },
    output: {
        path: path.resolve("dist"),
        publicPath: "/dist",
        filename: "[name].js"
    },
    devServer: {
        contentBase: "views"
    },
    module: {
        rules: [{
            test: /\.(js|es6)$/,
            exclude: /node_modules/,
            loader: 'jshint-loader',
            options: {
                "bitwise": true,
                "esversion": 6,
                "curly": true,
                "funcscope": true,
                "notypeof": true,
                "shadow": "inner",
                "undef": true,
                "unused": "strict",
                "asi": true,
                "debug": true,
                "loopfunc": false,
                "devel": true,
                "globals": {
                    "google": false,
                    "document": false,
                    "angular": true
                }
            },
            enforce: "pre"
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: "css-loader!autoprefixer-loader"
            })
        }, {
            test: /\.(js|es6)/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }],
    },
    resolve: {
        extensions: ['.js', '.es6', '.css']
    },
    plugins: [
        new ExtractTextPlugin("[name].css"),
    ]
}