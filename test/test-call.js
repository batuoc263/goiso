var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');
var multiStream = require('multistream')

function playMp3(name) {
    return new Promise(function (res, rej) {
        fs.createReadStream(name)
            .pipe(new lame.Decoder())
            .on('format', function (format) {
                const speaker = new Speaker(format);
                speaker.on('flush', () => {
                    console.log('speaker on flush');
                })
                this.pipe(speaker);
            }).on('error', function (err) {
                rej(err);
            }).on('end', () => {
                console.log('stream on close');
            })
    })
}

function numerToArrayOfDigits(number) {
    if (isNaN(number)) return console.log('NaN');
    return number.toString(10).split('').map(function (t) { return parseInt(t) })
}

function callNumber(number, counter) {
    digits_arr = numerToArrayOfDigits(number);

    streams = [fs.createReadStream('welcome.mp3')]
    for (let i in digits_arr) {
        streams.push(fs.createReadStream(digits_arr[i] + '.mp3'));
    }
    streams.push(fs.createReadStream('cometo.mp3'));

    digits_arr = numerToArrayOfDigits(counter);
    for (let i in digits_arr) {
        streams.push(fs.createReadStream(digits_arr[i] + '.mp3'));
    }

    multiStream(streams).pipe(new lame.Decoder())
        .on('format', function (format) {
            const speaker = new Speaker(format);
            this.pipe(speaker);
        }).on('error', function (err) {
            console.log(err);
        }).on('finish', () => {
            console.log('close multistream')
        })
}

callNumber(607, 4);

// module.exports.callNumber = callNumber
