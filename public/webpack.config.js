const path = require('path');

module.exports = {
    mode: 'development', // Set mode to 'development' or 'production'
    resolve: {
        modules: [path.resolve(__dirname, 'public'), 'node_modules'],
        extensions: ['.js', '.jsx', '.json'], // Add any other extensions you're using
    },
    entry: './script.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};