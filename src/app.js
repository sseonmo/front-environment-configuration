
import form from './form';
import result from './result';
import './app.css';

let formEl, resultEl;

document.addEventListener("DOMContentLoaded", async () => {
    formEl = document.createElement("div");
    formEl.innerHTML = form.render();
    document.body.appendChild(formEl);

    resultEl = document.createElement("div");
    resultEl.innerHTML = await result.render();
    document.body.appendChild(resultEl);

    // 다이나믹 임포트 사용시 설정
    // 웹팩이 이 파일을 처리할때 청크로 분리하는데 그 청그 이름을 설정한것 
    // import(/* webpackChunkName: "result" */"./result.js").then(async m => {
    //     const result = m.default;
    //     resultEl = document.createElement("div");
    //     resultEl.innerHTML = await result.render();
    //     document.body.appendChild(resultEl);
    // })

})

// devServer.hot 옵션을 켜면 웹팩 개발 서버 위에서 module.hot 객체가 생성
if (module.hot) {

    module.hot.accept('./result', async () => {
        resultEl.innerHTML = await result.render();
    })

    module.hot.accept('./form', () => {
        formEl.innerHTML = form.render();
    })
}

console.log("app.js");

// import './app.css';
// import nyancat from './nyancat.jpg';
// import axios from 'axios';

// document.addEventListener('DOMContentLoaded', async () => {
//     const res = await axios.get('api/users');
//     console.log(res);

//     // document.body.innerHTML = `
//     //     <img src="${nyancat}">
//     // `;

//     document.body.innerHTML = (res.data || []).map(user => {
//         return `<div>${user.id} : ${user.name}</div>`
//     }).join('')

// });

// console.log(process.env.NODE_ENV);
// console.log(TWO);
// console.log(TWO_STR);
// console.log(api.domain);
