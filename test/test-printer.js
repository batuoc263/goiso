const figlet = require('figlet');
const moment = require('moment');
const printer = require('printer');

moment.locale('vi');

function generateWaitingCard(nextNumber, currentNumber = nextNumber - 3) {
    return new Promise((res, rej) => {
        figlet.text('  ' + nextNumber, {
            font: 'Roman',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }, function (err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                rej(err);
                return;
            }
            // remove empty lines
            data = data.replace(/(^[ \t]*\n)/gm, '');

            let header = ['Ngan Hang Ky Thuong VietNam Techcombank', ''];
            let footer = ['Xin vui long doi den luot', 'So dang phuc vu: ' + currentNumber, 'Thoi gian: ' + moment().format('HH:mm:ss - D/MM/YYYY')];

            let output = '';
            for (let e in header) {
                output += '\t' + header[e] + '\n';
            }
            output += data + '\n';
            for (let e in footer) {
                output += '\t' + footer[e] + '\n';
            }
            res(output);
        });
    })
}

function print(text) {
    printer.printDirect({
        data: text,
        type: 'RAW',
        success: function (jobID) {
            console.log('sent to printer with ID: ' + jobID);
        },
        error: function (err) { console.log(err); }
    });
}

generateWaitingCard(1234)
    .then(data => console.log(data))
    .catch(err => console.log(err));
