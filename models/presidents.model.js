const mongoose = require('mongoose');

const presSchema = mongoose.Schema({
    presId: {type: Number, required: true},
    name: {type: String, required: true},
    startYear: {type: Number, required: true},
    endYear: Number,
    party: String,
    thumbnail: String,
    banner: String,
    snippet: String
});

const Presidents = mongoose.model('Presidents', presSchema);

module.exports = {Presidents};
