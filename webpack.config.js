const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/app.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve('./dist'),
    },
    module: {
        rules: [
            {
                test: /\.css$/, // 대상지정
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                // loader: 'file-loader',
                loader: 'url-loader',
                options: {
                    publicPath: './dist/', // 파일을 호출할때 앞에 publicPath를 붙쳐서 호출한다.
                    name: '[name].[ext]?[hash]', // 파일명 지정
                    limit: 18000, // url-loader 일때 사용가능
                },
            },
        ],
    },
};
