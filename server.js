const { fork } = require('child_process');
const bodyParser = require('body-parser');
const config = require('./config.json');
const cors = require('cors');
const env = require('dotenv').config();
const express = require('express')
const fs = require('fs');

const app = express();
const port = process.env.SERVER_PORT || 3040;

// middle wares
app.use(cors());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: false
}));

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/call', (req, res) => {
    console.log(req.query);
    if (!(req.query.number)) {
        return res.send('Missing params. e.g: /call?number=607')
    }
    try {
        const process = fork('./utils/caller.js');
        process.send({
            number: req.query.number,
        });
        return res.send('Ok')
    } catch (error) {
        console.log('error', error);
    }
});

app.get('/print', (req, res) => {
    console.log('print req.query', req.query);
    if (!(req.query.number && req.query.current)) {
        res.status(400);
        return res.send('Missing params. e.g: /print?current=10&number=12');
    }

    // if (req.query.number <= req.query.current) {

    // }

    try {
        const printer = fork('./utils/printer.js');
        printer.send({
            number: req.query.number,
            currentServingNumber: req.query.current
        });
        return res.send('Ok')
    } catch (error) {
        console.log('error', error);
        res.status(400);
        return res.send(error);
    }
})

app.get('/system-configs', async(req, res) => {
    console.log('system-configs', config);
    res.json({
        agency_id: config.AGENCY_ID
    });
})

app.post('/system-configs', (req, res) => {
    if (req.body.agencyId) {
        config.AGENCY_ID = req.body.agencyId;
        console.log('change config', config);
        fs.writeFile('./config.json', JSON.stringify(config, null, 2), (err) => {
            if (err) console.log(err);
        })
    }
    return res.json(config);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))