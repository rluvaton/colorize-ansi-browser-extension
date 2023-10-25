module.exports = {
    mode: 'production',

    // Only building what gonna be passed to the browser
    entry: './src/colorize.js',

    // Easier to debug
    optimization: {
        minimize: false
    },

    output: {
        filename: "colorize.js",
    }
}
