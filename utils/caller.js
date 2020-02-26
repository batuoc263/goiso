const path = require('path');
const env = require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })
const fs = require('fs');
const lame = require('lame');
const multiStream = require('multistream');
const Speaker = require('speaker');

function playMp3(name) {
    return new Promise(function(res, rej) {
        fs.createReadStream(name)
            .pipe(new lame.Decoder())
            .on('format', function(format) {
                const speaker = new Speaker(format);
                speaker.on('flush', () => {
                    console.log('speaker on flush');
                })
                this.pipe(speaker);
            }).on('error', function(err) {
                rej(err);
            }).on('end', () => {
                console.log('stream on close');
            })
    })
}

function numerToArrayOfDigits(number) {
    if (isNaN(number)) return console.log(`error: ${number} is NaN`);
    return number.toString(10).split('').map(function(t) { return parseInt(t) })
}

function callNumber(number) {
    if (number == 0) {
        // stream for welcome message
        streams = [fs.createReadStream(path.resolve(process.env.AUDIO_PATH, 'not_available.mp3'))]
    } else {
        // stream for welcome message
        streams = [fs.createReadStream(path.resolve(process.env.AUDIO_PATH, 'welcome.mp3'))]

        // stream for number message
        digits_arr = numerToArrayOfDigits(number);
        for (let i in digits_arr) {
            streams.push(fs.createReadStream(path.resolve(process.env.AUDIO_PATH, `${digits_arr[i]}.mp3`)));
        }
        streams.push(fs.createReadStream(path.resolve(process.env.AUDIO_PATH, 'cometoserve.mp3')));
    }

    // multiple streams to read all message at same time
    multiStream(streams).pipe(new lame.Decoder())
        .on('format', function(format) {
            const speaker = new Speaker(format);
            this.pipe(speaker);
        }).on('error', function(err) {
            console.log(err);
        }).on('finish', () => {
            console.log('Finish multistream for speaker')
        })
}

process.on('message', (message) => {
    callNumber(message.number, message.counter);
})