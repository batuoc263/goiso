const googleTTS = require('google-tts-api');
const fs = require('fs');
const request = require('request');

function getMp3(text) {
    return new Promise(function (resolve, reject) {
        googleTTS(String(text) || 'Mời khách hàng số.', 'vi', 1)   // speed normal = 1 (default), slow = 0.24
            .then(function (url) {
                // console.log(url); // https://translate.google.com/translate_tts?...
                resolve(url);
            })
            .catch(function (err) {
                // console.error(err.stack);
                reject(err);
            });
    })
}

function saveMp3(url, name = 'tmp') {
    return new Promise(function (res, rej) {
        request
            .get(url)
            .on('error', function (err) {
                rej(err);
            })
            .on('response', function (response) {
                res(response);
            })
            .pipe(fs.createWriteStream(name + '.mp3'));
    })
}

getMp3('Đến quầy số.').then(function (data) {
    console.log(data);
    saveMp3(data, 'cometo').then((res) => {
        console.log('Write to file successfully ', res);
    }).catch((err) => {
        console.error(err.stack);
    })
}).catch(function (err) {
    console.error(err.stack);
})

// (async function loop() {
//     for (let i = 0; i <= 10; i++) {
//         console.log(i);
//         await getMp3(i).then(function (data) {
//             saveMp3(data, i).then((res) => {
//                 console.log('Write to file successfully ', res);
//             }).catch((err) => {
//                 console.error(err.stack);
//             })
//         }).catch(function (err) {
//             console.error(err.stack);
//         })
//     }
// })()
