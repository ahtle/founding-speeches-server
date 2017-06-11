'use strict';

//**************** require **************/

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const {DATABASE_URL, PORT} = require('./config');
const {Presidents} = require('./models/presidents.model');
const {Transcripts} = require('./models/transcripts.model');
const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

const app = express();
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(cors());
mongoose.Promise = global.Promise;

app.use(express.static(path.join(__dirname, 'public')));

//***************** API ****************/

app.get('/', (req, res) => {
    console.log('Server side: GET ok');
    res.json({message: 'server side res OK'});
});

// get all presidents
app.get('/presidents', (req, res) => {
    Presidents.find().exec().then(presidents => {
        console.log(presidents);
        res.status(200).json(presidents);
    }).catch(err => {
        console.error(err);
        res.status(500).json({error: 'something went wrong'});
    });
})

// post new president
function validatePost(data){
    const requiredFields = ['presId', 'name', 'startYear', 'endYear'];
    for(let i = 0; i < requiredFields.length; i++){
        const field = requiredFields[i];
        if(!(field in data.body)){
            console.error(`missing '${field}' in request body`);
            return false;
        }
    }
    return true;
};

app.post('/presidents', (req, res) => {
    if(validatePost(req)){
        const newPres = {
            presId: req.body.presId,
            name: req.body.name,
            startYear: req.body.startYear,
            endYear: req.body.endYear,
            thumbnail: req.body.thumbnail || '',
            banner: req.body.banner || '',
            snippet: req.body.snippet || '',
            speeches: []
        };

        return Presidents.create(newPres).then(pres => {
                console.log(pres);
                res.status(201).json(pres);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({error: 'something went wrong'});
            });
    } // end validated
})

// get all president transcripts
app.get('/transcripts/:presId', (req, res) => {
    Transcripts.find({presId: req.params.presId}).sort({date: 1}).exec().then(transcripts => {
        console.log(transcripts);
        res.status(200).json(transcripts);
    }).catch(err => {
        console.error(err);
        res.status(500).json({error: 'something went wrong'});
    });
})

// post new transcript
function validateTranscriptPost(data){
    const requiredFields = ['presId', 'date', 'title', 'text'];
    for(let i = 0; i < requiredFields.length; i++){
        const field = requiredFields[i];
        if(!(field in data.body)){
            console.error(`missing '${field}' in request body`);
            return false;
        }
    }
    return true;
};

app.post('/transcripts', (req, res) => {
    if(validateTranscriptPost(req)){
        const newTranscript = {
            presId: req.body.presId,
            date: req.body.date,
            title: req.body.title,
            text: req.body.text
        }

        return Transcripts.create(newTranscript).then(transcript => {
                console.log(transcript);
                res.status(201).json(transcript);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({error: 'something went wrong'});
            });
    }
});

// catch all
app.get('*', (req, res) => {
    console.log('server message: not found')
    res.json({message: 'not found'});
});

/************** get Watson profile *****************/
app.post('/watson', (req, res) => {

    var personality_insights = new PersonalityInsightsV3({
        username: '507f3d3b-10a0-4cba-a409-423da0bf5915',
        password: '8cSh3iwYj8l1',
        version_date: '2016-10-20'
    });

    var params = {
        content_items: [req.body],
        headers: {
            'accept-language': 'en',
            'accept': 'application/json'
        }
    };

    return personality_insights.profile(params, (err, response) => {
        if (err)
            console.error(err);
        else{
            let output = JSON.stringify(response, null, 2);
            console.log(output);
            return res.status(200).send(output);
        }     
    });

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
