const mongoose = require('mongoose');

const abbsSchema = new mongoose.Schema({
    div: {
        type: String,
        required: true
    },
    values: {
        type: Array,
        required: true,
    }
}, { collection: 'abbs' });

module.exports = mongoose.model('ABBS', abbsSchema);