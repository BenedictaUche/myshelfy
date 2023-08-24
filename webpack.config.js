// webpack.config.js
const path = require('path');

module.exports = {
    entry: './public/app.js', // Entry point of your client-side code
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'), // Output directory
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'), // Serve files from this directory
        compress: true,
        port: 8000,
    },
    mode: 'development',
};
