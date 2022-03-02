const mongoose = require('mongoose');

const abbPop = mongoose.model('ALL ABBS', new mongoose.Schema({
    populate_data: {
        type: Array,
        ref: mongoose.model('ABBS POPUP', new mongoose.Schema({
            div: {
                type: String,
                required: true
            },
            values: {
                type: Array,
                required: true,
            }
        }, { collection: 'abbs' }))
    }
}, { collection: 'all_abbs' }));

module.exports = abbPop;