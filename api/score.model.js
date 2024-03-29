const mongoose = require('mongoose')

const scoreSchema = mongoose.Schema({
    scoreName: {
        type: String,
        required:true
    },
    score:{
        type: Number,
        required:true
    }
})

const Score = mongoose.model('Score',scoreSchema);

module.exports = Score; 