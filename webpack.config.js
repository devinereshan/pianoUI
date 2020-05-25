const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/PianoUI.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'PianoUI.js',
        library: 'PianoUI',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    }
                ]
            },
        ],
    },
};