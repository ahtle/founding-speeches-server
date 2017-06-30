const mongoose = require('mongoose');

const presSchema = mongoose.Schema({
    presId: {type: Number, required: true},
    name: {type: String, required: true},
    startYear: {type: Number, required: true},
    endYear: {type: Number, required: true},
    thumbnail: String,
    banner: String,
    snippet: String
});

const Presidents = mongoose.model('Presidents', presSchema);

module.exports = {Presidents};
