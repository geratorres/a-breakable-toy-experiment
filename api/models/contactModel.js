const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    company: {
        type: String
    },
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
});

contactSchema.plugin(paginate);

const contactModel = mongoose.model('Contact', contactSchema);

module.exports = contactModel;
