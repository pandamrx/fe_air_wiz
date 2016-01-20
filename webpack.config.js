var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        index: './js/app.js',
        datepicker: './js/datepicker.js'
    },
    output: {
        path: path.join(__dirname, 'js/dist/'),
        filename: "[name].bundle.js"
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
};