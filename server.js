'use strict';

//**************** require **************/

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
//const path = require('path');
const {DATABASE_URL, PORT} = require('./config');
const presidentsRouter = require('./router/presidentsRouter');
const transcriptsRouter = require('./router/transcriptsRouter');
const watsonRouter = require('./router/watsonRouter');


const app = express();
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(cors());

mongoose.Promise = global.Promise;

//app.use(express.static(path.join(__dirname, 'public')));

// router
app.use('/api/v1/presidents', presidentsRouter);
app.use('/api/v1/transcripts', transcriptsRouter);
app.use('/api/v1/watson', watsonRouter);

//***************** API ****************/

app.get('/', (req, res) => {
    console.log('Server side: GET ok');
    res.json({message: 'server side res OK'});
});

// catch all
app.get('*', (req, res) => {
    console.log('server message: not found')
    res.json({message: 'not found'});
});

//****************** server ***************/
let server;

// connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT){
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, (err) => {
            if(err)
                return reject(err);
            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve();
            })
            .on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        }); // end connect
    }); // end promise
};

// close the srever and returns a promise. Used in integration tests
function closeServer(){
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if(err)
                    return reject(err);
                resolve();
            });
        });
    });
};

// if server.js is called directly (aka, with 'node server.js'), this block runs.
// we can also export runServer comman so test code can start as needed
if(require.main === module){
    runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};

// mongoimport --db founding-speeches --collection presidents --drop --file ~/Desktop/president_seed.json --host ds137370.mlab.com --port 37370  -u anhhtle -p password1