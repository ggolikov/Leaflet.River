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
        path: './dist',
        filename: 'bundle.js',
        library: 'leaflet'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.png$/, loader: 'url-loader', query: { mimetype: 'image/png' }}
        ]
    },
    watch: true,
    devServer: {
        contentBase: '',
        info: true,
        // hot: true,
        inline: true
    }
};
