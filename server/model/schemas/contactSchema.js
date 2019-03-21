const mongoose = require('mongoose');
const validator = require('validator');
const paginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: {
        type: String,
        required: 'Name is required!',
        validate: [
            { validator: validator.isAlpha, msg: 'Name must be alphabetic' }
        ]
    },
    lastName: {
        type: String,
        required: 'Last name is required!',
        validate: [
            { validator: validator.isAlpha, msg: 'Last name must be alphabetic' }
        ]
    },
    company: {
        type: String,
        validate: [
            //TODO see how to implement the locale and ask if it mustbe from server or client
            { validator: validator.isAlphanumeric, msg: 'Company must be alphanumeric' }
        ]
    },
    phoneNumber: {
        type: String,
        unique: true,
        validate: [
            { validator: validator.isNumeric, msg: 'PhoneNumber must be numeric' }
        ]
    },
    email: {
        type: String,
        unique: true,
        required: 'email is required!',
        validate: [
            { validator: validator.isEmail, msg: 'Invalid Email' }
        ]
    }
});

contactSchema.plugin(paginate);

const ContactModel = mongoose.model('Contact', contactSchema);

module.exports = ContactModel;