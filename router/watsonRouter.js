'use strict'
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

router.use(bodyParser.json());

router.post('/', (req, res) => {
    var personality_insights = new PersonalityInsightsV3({
        username: '507f3d3b-10a0-4cba-a409-423da0bf5915',
        password: '8cSh3iwYj8l1',
        version_date: '2016-10-20'
    });

    var params = {
        content_items: [req.body.text],
        headers: {
            'accept-language': 'en',
            'accept': 'application/json'
        }
    };

    return personality_insights.profile(params, (err, response) => {
        if (err)
            console.error(err);
        else{
            //let output = JSON.stringify(response, null, 2);
            console.log(response);
            let personality = response.personality.map((obj) => {
                return {
                    "name": obj.name,
                    "percentile": (100*obj.percentile).toFixed(0),
                    "children": obj.children.map(children => {
                        return {"name": children.name, "percentile": children.percentile}
                    }).sort((a,b) => {return b.percentile - a.percentile})
                }
            });
            let needs = response.needs.map((obj) => {
                return {"name": obj.name, "percentile": (100*obj.percentile).toFixed(0)}
            });
            let values = response.values.map((obj) => {
                return {"name": obj.name, "percentile": (100*obj.percentile).toFixed(0)}
            });

            let outputFormatted = {
                word_count: response.word_count,
                personality: personality.sort((a,b) => {return a.percentile - b.percentile}),
                needs: needs.sort((a,b) => {return a.percentile - b.percentile}),
                values: values.sort((a,b) => {return a.percentile - b.percentile})
            }

            return res.status(200).send(outputFormatted);
        }     
    });

});

module.exports = router;