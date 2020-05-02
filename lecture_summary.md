참조(김정환님 블로그) - https://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html

## 자주사용하는 loader

#### css-loader

-   스타일시트로 import 구문으로 불라올수 있게 한다.
-   css 파일을 자바스크립트에서 불러와 사용하려면 css를 모듈로 변환하는작업이 필요하다.
-   css-loader가 그역활을 수행한다.

#### style-loader

-   자바스크립트로 변경된 스타일시트를 동적으로 돔에 추가하는 로더이다.

#### file-loader

-   파일을 모듈 형태로 지원하고 웹팩 아웃풋에 파일을 옮겨주는 역활을 한다.

#### url-loader

-   이미지를 Base64로 인코딩하여 문자열 형태로 소스코드에 넣어주는 역활을한다.
-   사용하는 이미지 갯수가 많다면 네트웍 리소스를 사용하는 부담이 있고 성능에 영향을 줄 수도 있다. 만약에 한 페이지에서 작은 이미지를 여러개 사용한다면 <u>Data URI Schema</u>을 이용하는 방법이 더 낫다.

```js
// webpack.config.js
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
```

## plugin

-   로더가 파일 단위로 처리하는 반면 플러그인은 번들된 결과물을 처리한다.
-   번들된 자바스크립트를 난독화 한다거나 특정 테스트를 추출하는 용도로 사용한다.

### 자주사용하는 plugin

#### BannerPlugin

-   웹팩에 내장되어 있는 플러그인
-   결과물에 빌드 정보 및 커밋 정보같은 필요한 정보를 추가해서 남길수 있게 해준다

#### DefinePlugin

-   웹팩에 내장되어 있는 플러그인
-   빌드타임에 결절된 값을 application에 전달 할때 유요한 플러그인
-   환경별 값이 틀려지는 특정변수의 값에 사용하기 좋을거 같음

#### HtmlWebpackPlugin

-   npm install html-webpack-plugin
-   웹팩으로 빌드한 결과물로 HTML 파일을 생성해주는 플러그인
-   templateParamter를 설정할 수 있기 때문에.. 사용시 상당히 유요할 것 같음
-   빈칸제거 및 주석제거 기능도 제공함

#### CleanWebpackPlugin

-   npm install clean-webpack-plugin
-   빌드 이전 결과를 제거해주는 플러그인
-   주의사항 : CleanWebpackPlugin 를 default 로 export 하지 않기때문에 주의가 필요함
-   require : `const { CleanWebpackPlugin } = require('clean-webpack-plugin');`

#### MiniCssExtractPlugin

-   npm install mini-css-extract-plugin
-   번들된 결과에서 css를 분리해주는 플러그인
-   브라우저에서 큰 파일을 하나를 내려받는 것 보다, 여러 개의 작은 파일을 동시에 다운로드 하는것이 성능이 더 이롭다.
-   사용시 style-loader 사용하는 부분이 있다면 MiniCssExtractPlugin.loader 로 변경이 필요하다.

```js
// webpack.config.js

const path = require('path');
const MyWebpackPlugin = require('./my-webpack-plugin');
const webpack = require('webpack');
const childProcess = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
```
