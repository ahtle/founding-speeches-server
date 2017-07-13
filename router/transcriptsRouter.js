'use strict'
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {Transcripts} = require('../models/transcripts.model');

router.use(bodyParser.json());

// get all transcripts from a president
router.get('/:presId', (req, res) => {
    Transcripts.find({presId: req.params.presId}).sort({date: -1}).exec().then(transcripts => {
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

router.post('/', (req, res) => {
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

// delete transcript
router.delete('/:transcriptId', (req, res) => {
    Transcripts.findByIdAndRemove(req.params.transcriptId).exec().then(respond => {
        res.status(200).json(respond);
    }).catch(err => {
        console.error(err);
        res.status(500).json({error: 'something went wrong'});
    })
});

module.exports = router;