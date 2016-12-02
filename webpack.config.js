var webpack = require('webpack'),
    path = require('path'),
    srcPath = path.join(__dirname, 'src');

module.exports = {
    node: {
        __dirname: true
    },
    target: "web",
    cache: true,
    entry: {
        entry: [
            // instead of inline: true
            // 'webpack-dev-server/client',
            // instead of hot: true
            // 'webpack/hot/dev-server',
            path.join(srcPath, 'entry.js')
        ]
    },
    output: {
        // interpolateLineRange: 'line-interpolate-points',
        path: './dist',
        filename: 'bundle.js'
        // library: 'leaflet'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.png$/, loader: 'url-loader', query: { mimetype: 'image/png' }}
        ]
    },
    plugins: [
            new webpack.ProvidePlugin({
                interpolateLineRange: 'node_modules/line-interpolate-points/index.js'
            })
    ],
    watch: true,
    devServer: {
        contentBase: '',
        info: true,
        // hot: true,
        inline: true
    }
};
