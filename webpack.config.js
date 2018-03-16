var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// The list of node modules to include in the vendor bundle.
// If we know that we will be updating a module often then include
// it in the app bundle or a different bundle.
const VENDOR_LIBS = [
    'react',
    'lodash',
    'redux',
    'react-redux',
    'react-dom',
    'react-input-range',
    'redux-form',
    'redux-thunk',
    'faker'
];

module.exports = {
    entry: {
        // Create a bundle starting at index.js
        bundle: './src/index.js',
        // Create the vendor bundle
        vendor: VENDOR_LIBS
    },
    output: {
        path: path.join(__dirname, 'dist'),
        // [name] tells webpack to use the name of the bundled specified in the entry object.
        // i.e. bundle.js and vendor.js
        // [chunkhast] tells webpack to substitute a hash value of the bundle here.  If the
        // bundle file changes then the hash will be different.  This is a cache buster.
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [
            {
                // transpile all js files except those in the node_modules directory
                use: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                use: ['style-loader', 'css-loader'],
                test: /\.css$/
            }
        ]
    },
    plugins: [
        // Tell webpack to compare the bundle to the vendor bundle and remove
        // duplicates from bundle.js.  In other words, vendor modules should
        // only be in the vendor bundle.
        new webpack.optimize.CommonsChunkPlugin({
            // Use name when you're not cache busting.
            //name: 'vendor'

            // This plugin does not really know when vendor libs change even though
            // we added the chunkhash above.  If we change any bundle, then webpack
            // will assume that the vendor bundle changed as well.  The names array
            // solves this problem.
            // The manifest helps the browser determine if the vendor bundle has changed
            // since the last cache.
            names: ['vendor', 'manifest']
        }),
        // Takes src/index.html template and adds script tags for each bundle just before </html>
        // It outputs the new index.html in the dist directory.
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ]
};
