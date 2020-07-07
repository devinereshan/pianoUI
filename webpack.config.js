const path = require('path');

const defaults = {
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

const test = Object.assign({}, defaults, {
    entry: './test/PianoUI.test.js',
    output: {
        filename: 'PianoUI.test.js',
    },
});

const minify = Object.assign({}, defaults, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'PianoUI.min.js',
        library: 'PianoUI',
        libraryTarget: 'umd',
    },
})

module.exports = env => {
    if (env.test) {
        return test;
    } else if (env.minify) {
        return minify;
    } else {
        return defaults;
    }
}