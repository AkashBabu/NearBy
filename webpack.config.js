var path = require('path')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

var glob = require("glob")
var PurifyCSSPlugin = require("purifycss-webpack")


module.exports = {
    context: path.resolve("public"),
    entry: {
        "login/bundle": './js/login/app', 
        "login/styles": './css/login.css'
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
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'jshintrc'
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: "css-loader"
            })
        }],
        loaders: [{
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }, {
            test: /\.es6$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    resolve: {
        extensions: ['.js', '.es6', '.css']
    },
    plugins: [
        new ExtractTextPlugin("[name].css"),
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, "views/login.html"))
        })
    ]
}