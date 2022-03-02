const mongoose = require('mongoose');

const repSchema = new mongoose.Schema({
    div: {
        type: String,
        required: true
    },
    values: {
        type: Array,
        required: true
    }
}, { collection: 'reps' });

module.exports = mongoose.model('REPS', repSchema);