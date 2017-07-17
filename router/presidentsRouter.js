'use strict'
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {Presidents} = require('../models/presidents.model');

router.use(bodyParser.json());

//********** API *************/

// get all presidents
router.get('/', (req, res) => {
    Presidents.find().sort({presId: 1}).exec().then(presidents => {
        res.status(200).json(presidents);
    }).catch(err => {
        console.error(err);
        res.status(500).json({error: 'something went wrong'});
    });
})

// post new president
function validatePost(data){
    const requiredFields = ['presId', 'name', 'startYear'];
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
    if(validatePost(req)){
        const newPres = {
            presId: req.body.presId,
            name: req.body.name,
            startYear: req.body.startYear,
            endYear: req.body.endYear || '',
            party: req.body.party || '',
            thumbnail: req.body.thumbnail || '',
            banner: req.body.banner || '',
            snippet: req.body.snippet || ''
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

// update president
function getUpdate(data){
    const updateableFields = ['presId', 'name', 'startYear', 'endYear', 'party', 'thumbnail', 'banner', 'snippet'];
    let updatePresident = {};
    updateableFields.forEach(field => {
        if(field in data.body){
            updatePresident[field] = data.body[field];
        }
    });

    return updatePresident;
};

router.put('/:presId', (req, res) => {
    // get updata data
    let update = getUpdate(req);
    
    Presidents.findOneAndUpdate({presId: req.params.presId}, {$set: update}, {new: true})
    .exec()
    .then(president => res.status(201).json(president))
    .catch(err => res.status(500).json(err));
});

// delete president
router.delete('/:presId', (req, res) => {
    Presidents.findOneAndRemove({presId: req.params.presId})
    .exec()
    .then((deleted) => {
        if(deleted === null){
            res.status(400).json({message: `can't find president to delete`});
        }
        res.status(204).json({message: `deleted president ${req.params.presId}`});
    })
    .catch(err => res.status(500).json(err));
})

module.exports = router;