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

module.exports = env => {
    if (env.test) {
        return test;
    } else {
        return defaults;
    }
}