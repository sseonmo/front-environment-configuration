참조(김정환님 블로그) - https://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html

### 자주사용하는 loader

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

## [Babel](https://babeljs.io/)

-   바벨은 일관적인 방식으로 코딩하면서, 다양한 브라우저에서 동작될 수 있게 어플리케이션을 만들기 위한 도구 이다.
-   3 단계로 빌드한다.
    > 1. 파싱(Parsing) / 코드를 읽고 추상 구문 트리(AST)로 변환한다.
    > 2. 변환(Transforming) / 추상 구문 트리를 변경한다.
    > 3. 출력(Printing) / 변경된 출력물을 출력한다.
-   바벨의 코어는 파싱과 출력만 당당하고 변환작업은 플러그인이 처리한다.
-   여러개의 플러그인을 모아놓은 세트를 프리셋이라고 하는데 ECNAScript+ 환경은 env 프리셋을 사용한다.
-   바벨이 변환하지 못하는 코드는 폴리필이라고 부르는 코드조각을 불러와 결과물에 로딩해서 해결한다.

```js
// babel.config.js - babel 설정파일
// npm i @babel/core @babel/cli @babel/preset-env core-js@2
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    chrome: '79',
                    ie: '11',
                },
                useBuiltIns: 'usage', //entry // 폴리필을 사용하겠다는 의미(usage, entry) / default : false
                corejs: {
                    version: 2, // 3    // core-js  2버전을 사용하겠다는 의미
                },
            },
        ],
    ],
};

// webpack.config.js
// npm i babel-loader
// loader를 babel-loader 로 설정한다. 기본적으로 babel 설정 파일이 있는지 없는지 먼저 찾는다.
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_module/,
            },
        ],
    },
};
```

#### [sass-loader](https://github.com/webpack-contrib/sass-loader)

-   .sass, scss를 css로 파싱하는 loader

```js
// webpack.config.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
        ],
    },
};
```

### [esLint](https://eslint.org/)

-   설치 : `npm install eslint`
-   ESLint는 ECMAScript 코드에서 문제점을 검사하고 일부는 더 나은 코드로 저장하는 린트 도구 중 하나이다.
-   코드의 가독성을 높이고 잠재적인 오류와 버그를 제거해 단단한 코드를 만드는 것이 목적이다.
-   코드에서 검사하는 항목은 크게 두가지 분류된다.
    -   포맷팅 / 일관된 코드 스타일을 유지하도록해 코드 가독성을 높여준다.(들여쓰기 규칙, 코드 라인의 최대 너비 규칙)
    -   코드품질 / 어플리케이션의 잠재적(potential)인 오류나 버그를 예방하기 위함이다.
-   보통은 직접생성하는 방식이 아닌 초기화명령어를 통해 생성한다. `npx eslint --init`명령어를 실행하면 대화식 명령어로 진행되며 자신의 프로젝트에 맞게 답하면 된다. 답변에 따라 .eslintrc.js 설정파일을 생성한다.

    ```js
     npx eslint --init

    ? How would you like to use ESLint?
    ? What type of modules does your project use?
    ? Which framework does your project use?
    ? Does your project use TypeScript?
    ? Where does your code run?
    ? What format do you want your config file to be in?
    ? Would you like to install them now with npm?

    ```
    ```js
    // .eslintrc.js 
    module.exports = {
        "env": {
            "browser": true,
            "es6": true
        },
        "extends": ["eslint:recommended"],  // 미리 설정된 규칙 세트을 사용한다
        "globals": {
            "Atomics": "readonly",
            "SharedArrayBuffer": "readonly"
        },
        "parserOptions": {
            "ecmaVersion": 2018,
            "sourceType": "module"
        },
        "rules": {
        }
    };
    ```


-   eslint 실행시 `--fix` 해당 옵션을 주면 수정가능한 것들은 자동수정된다.([규칙목록중 왼쪽에 렌치표시가 있는것](https://eslint.org/docs/rules/))

## 그외

### npx

-   Node 팩키지를 실행시키는 하나의 도구이다. (npm 5.2)

```text
1. 기본적으로 실행되여할 패키지가 경로에 있는지 면저 확인한다.
2. 경로에 있다면, 그대로 실행한다.
3. 없다면 npx가 최신패키지를 설치를 한 후 실행한다.
4. 실행이 끝난후에 삭제한다.
```

-   일회성 패지지 명령이나 간편하게 현재 설치된 cli 기능을 이용 할 때 용이한다.
    > npx create-react-app my-app
