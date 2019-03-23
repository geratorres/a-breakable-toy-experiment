const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const Joi = require('joi');

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    company: {
        type: String
    },
    phoneNumber: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true,
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

/* dont throws validations errors, Idont now why
contactSchema.pre('save', function (doc, saveOptions, next) {
    doc.updated = Date.now();
    //TODO: Beware about weird arguments layout, in documentation second parameter should be next 
    //but actually second is an object with name saveOptions
    // and third is a function (err) => {}
    next();
});
*/

contactSchema.statics.joiValidate = contact => {

    const contactJoiSchema = Joi.object().keys({
        company: Joi.string().trim().regex(/^[a-z\d -_]+$/i, 'alphanumeric'),
        phoneNumber: Joi.string().trim().regex(/^[\d]+$/, 'numbers'),
        email: Joi.string().trim().email().required(),
        firstName: Joi.string().trim().required().regex(/^[a-z ]+$/i, 'alphabetic'),
        lastName: Joi.string().trim().required().regex(/^[a-z ]+$/i, 'alphabetic')
    });

    return Joi.validate(contact, contactJoiSchema);
};

contactSchema.statics.joiValidateToUpdate = contact => {

    const contactJoiSchema = Joi.object().keys({
        company: Joi.string().trim().regex(/^[a-z\d -_]+$/i, 'alphanumeric'),
        phoneNumber: Joi.string().trim().regex(/^[\d]+$/, 'numbers'),
        email: Joi.string().trim().email(),
        firstName: Joi.string().trim().regex(/^[a-z ]+$/i, 'alphabetic'),
        lastName: Joi.string().trim().regex(/^[a-z ]+$/i, 'alphabetic')
    });

    return Joi.validate(contact, contactJoiSchema);
};

contactSchema.plugin(paginate);

module.exports = mongoose.model('Contact', contactSchema);
