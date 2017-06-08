const mongoose = require('mongoose');

const transcriptSchema = mongoose.Schema({
    presId: {type: Number, required: true},
    transcriptId: {type: Number, required: true},
    date: {type: Date, required: true},
    title: {type: String, required: true},
    text: {type: String, required: true}
});

const Transcripts = mongoose.model('Transcripts', transcriptSchema);

module.exports = {Transcripts};
