const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require('../server');
const should = chai.should();
chai.use(chaiHttp);

describe('API', function () {

    before(() => {
        return runServer();
    })

    after(() => {
        return closeServer();
    })

    // get presidents
    it('should 200 on GET requests', () => {
        return chai.request(app)
            .get('/api/v1/presidents')
            .then((res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');

                const children = res.body[0];
                children.should.include.keys('_id', 'presId', 'name', 'startYear', 'endYear', 'snippet', 'thumbnail', 'banner');
            });
    });

    // post presidents
    it('should add new president on POST', () => {
        const newPres = {
            presId: 100,
            name: 'test name',
            party: 'cool party',
            startYear: 2020,
            endYear: 2021,
            snippet: 'snippet',
            thumbnail: 'thumbnail',
            banner: 'banner'
        }

        return chai.request(app)
            .post('/api/v1/presidents')
            .send(newPres)
            .then((res) => {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.include.keys('_id', 'presId', 'name', 'party', 'startYear', 'endYear', 'snippet', 'thumbnail', 'banner');
                res.body.presId.should.equal(newPres.presId);
                res.body.name.should.equal(newPres.name);
            });
    });

    // update president
    it('should update president on PUT', () => {
        const update = {
            name: 'new name',
            party: 'super cool party'
        };

        return chai.request(app)
            .put('/api/v1/presidents/100')
            .send(update)
            .then((res) => {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.name.should.equal(update.name);
                res.body.party.should.equal(update.party);
            })
    });

    // delete president
    it('should delete president on DELETE', () => {
        return chai.request(app)
            .delete('/api/v1/presidents/100')
            .then((res) => {
                res.should.have.status(204);
            })
    });

    // get transcripts
    it('should get transcripts on GET', () => {
        return chai.request(app)
            .get('/api/v1/transcripts/1')
            .then((res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.length.should.be.at.least(1);

                const transcript = res.body[0];
                transcript.should.include.keys('_id', 'presId', 'date', 'title', 'text');
            })
    })

    // post transcripts

    //let id;

    // it('should add transcript on POST', () => {
    //     const newTranscript = {
    //         presId: 1,
    //         date: new Date(),
    //         title: 'title',
    //         text: 'text'
    //     }

    //     return chai.request(app)
    //         .post('/api/v1/transcripts/')
    //         .send(newTranscript)
    //         .then((res) => {
    //             res.should.have.status(201);
    //             res.should.be.json;
    //             res.body.should.be.a('object');
    //             res.body.should.include.keys('_id', 'presId', 'date', 'title', 'text');
    //             res.body.presId.should.equal(newTranscript.presId);
    //             res.body.title.should.equal(newTranscript.title);
    //             res.body.text.should.equal(newTranscript.text);

    //             id = res.body._id;
    //         });
    // })

    // it('should delete transcript on DELETE', () => {
    //     return chai.request(app)
    //         .delete(`/api/v1/transcripts/${id}`)
    //         .then((res) => {
    //             res.should.have.status(204);
    //             res.should.be.json;
    //         })
    // })
    
    // get watson profile on post
    it('should get watson profile on post', () => {
        const text = {text: "Many years have passed since the White people first came to America. In that long space of time many good men have considered how the condition of the Indian natives of the country might be improved; and many attempts have been made to effect it. But, as we see at this day, all these attempts have been nearly fruitless. I also have thought much on this subject, and anxiously wished that the various Indian tribes, as well as their neighbours, " +
        "the White people, might enjoy in abundance all the good things which make life comfortable and happy. I have considered how this could be done; and have discovered but one path that could lead them to that desirable situation. In this path I wish all the Indian nations to walk. From the information received concerning you, my beloved Cherokees, I am inclined to hope that you are prepared to take this path and disposed to pursue it. It may seem a little difficult " +
        "to enter; but if you make the attempt, you will find every obstacle easy to be removed. Mr. Dinsmoor, my beloved agent to your nation, being here," + 
        "I send you this talk by him. He will have it interpreted to you, and particularly explain my meaning."};

        return chai.request(app)
            .post('/api/v1/watson')
            .send(text)
            .then((res) => {
                res.should.have.status(200);
                res.should.be.json
                res.body.should.be.a('object');
                res.body.should.include.keys('word_count', 'personality', 'needs', 'values');
            })
    })
});