const path = require('path');
const MyWebpackPlugin = require('./my-webpack-plugin');
const webpack = require('webpack');
const childProcess = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const apiMocker = require('connect-api-mocker');


module.exports = {
    mode: 'development',
    entry: {
        main: './src/app.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve('./dist'),
    },
    devServer: {
        overlay: true,
        stats: 'errors-only',
        before: (app) => {
            // app.get('/api/users', function (req, res) {
            //     res.json();
            // });
            app.use(apiMocker('/api', 'mocks/api'))
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/, // 대상지정
                use: [
                    process.env.NODE_ENV === 'production'
                        ? MiniCssExtractPlugin.loader
                        : 'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                // loader: 'file-loader',
                loader: 'url-loader',
                options: {
                    // publicPath: './dist/', // 파일을 호출할때 앞에 publicPath를 붙쳐서 호출한다.
                    name: '[name].[ext]?[hash]', // 파일명 지정
                    limit: 18000, // url-loader 일때 사용가능
                },
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_module/,
            },
        ],
    },
    plugins: [
        // new MyWebpackPlugin()
        new webpack.BannerPlugin({
            banner: `
                Build Date: ${new Date().toLocaleString()}
                Commit Version : ${childProcess.execSync(
                'git rev-parse --short HEAD',
            )}
                Author : ${childProcess.execSync('git config user.name')}
            `,
        }),
        new webpack.DefinePlugin({
            TWO: '1+1',
            TWO_STR: JSON.stringify('1+1'),
            'api.domain': JSON.stringify('http://dev.api.domain.com'),
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            templateParameters: {
                env: process.env.NODE_ENV === 'development' ? '(개발용)' : '',
            },
            minify:
                process.env.NODE_ENV === 'production' // production mode 일때만 적용되도록
                    ? {
                        collapseWhitespace: true, // 빈값제거
                        removeComments: true, // 주석제거
                    }
                    : {},
        }),
        new CleanWebpackPlugin(), // 빌드 이전 결과물을 제거하는 plugin
        ...(process.env.NODE_ENV === 'production'
            ? [
                new MiniCssExtractPlugin({
                    filename: `[name].css`,
                }),
            ]
            : []),
    ],
};
