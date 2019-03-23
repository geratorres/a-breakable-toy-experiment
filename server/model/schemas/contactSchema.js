const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const Joi = require('joi');

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    firstName: {
        type: String,
        required: 'Name is required!'
    },
    lastName: {
        type: String,
        required: 'Last name is required!'       
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
        required: 'email is required!'
    },
    created: {
        type: Date,
        default: Date.now
    },
});

contactSchema.statics.joiValidate = contact => {    

    const contactJoiSchema = Joi.object().keys({
		company: Joi.string().trim().regex(/^[a-z\d -_]+$/i, 'alphanumeric'),
		phoneNumber: Joi.string().trim().regex(/^[\d]+$/, 'numbers'),
		email: Joi.string().trim().email().required(),
		firstName: Joi.string().trim().required().regex(/^[a-z ]+$/i,'alphabetic'),
		lastName: Joi.string().trim().required().regex(/^[a-z ]+$/i, 'alphabetic')
    });
    
	return Joi.validate(contact, contactJoiSchema);
};

contactSchema.plugin(paginate);

module.exports = mongoose.model('Contact', contactSchema);
