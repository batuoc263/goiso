const figlet = require('figlet');
const moment = require('moment');
const printer = require('printer');

moment.locale('vi');

function generateWaitingCard(number, currentServingNumber) {
    return new Promise((res, rej) => {
        figlet.text('   ' + number, {
            font: 'Roman',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }, function(err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                rej(err);
                return;
            }
            // remove empty lines
            data = data.replace(/(^[ \t]*\n)/gm, '');

            let header = ['Phong kham Da khoa VNPT Health', ''];
            let footer = ['Xin vui long doi den luot', 'So dang phuc vu: ' + currentServingNumber, 'Thoi gian: ' + moment().format('HH:mm:ss - D/MM/YYYY')];

            let output = '';
            for (let e in header) {
                output += '\t' + header[e] + '\n';
            }
            output += data + '\n';
            for (let e in footer) {
                output += '\t' + footer[e] + '\n\n';
            }
            res(output);
        });
    })
}

function print(text) {
    console.log(text);
    printer.printDirect({
        data: text,
        type: 'RAW',
        success: function(jobID) {
            console.log('Sent to printer with ID: ' + jobID);
            cutPaper();
        },
        error: function(err) { console.log(err); }
    });
}

function cutPaper() {
    printer.printDirect({
        data: "\n \n \n \n \x1B@\x1DV1",
        type: 'RAW',
        success: function(jobID) {
            console.log("Sent cut command to printer with ID: " + jobID);
        },
        error: function(err) { console.log(err); }
    });
}

process.on('message', (message) => {
    generateWaitingCard(message.number, message.currentServingNumber)
        .then(data => print(data))
        .catch(err => console.log(err));
})