참조(김정환님 블로그) - https://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html

## 자주사용하는 loader

-   css-loader
    > 스타일시트로 import 구문으로 불라올수 있게 한다.
    > css 파일을 자바스크립트에서 불러와 사용하려면 css를 모듈로 변환하는작업이 필요하다.
    > css-loader가 그역활을 수행한다.
-   style-loader
    > 자바스크립트로 변경된 스타일시트를 동적으로 돔에 추가하는 로더이다.
-   file-loader
    > 파일을 모듈 형태로 지원하고 웹팩 아웃풋에 파일을 옮겨주는 역활을 한다.
-   url-loader

    > 이미지를 Base64로 인코딩하여 문자열 형태로 소스코드에 넣어주는 역활을한다.

    `사용하는 이미지 갯수가 많다면 네트웍 리소스를 사용하는 부담이 있고 성능에 영향을 줄 수도 있다. 만약에 한 페이지에서 작은 이미지를 여러개 사용한다면 <u>Data URI Schema</u>을 이용하는 방법이 더 낫다.`

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
