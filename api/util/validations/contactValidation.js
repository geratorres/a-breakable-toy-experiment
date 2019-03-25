module.exports = function joiValidateContact(contact) {
    const Joi = require('joi');

    const contactJoiSchema = Joi.object().keys({
        company: Joi.string().trim().regex(/^[a-z\d -_]+$/i, 'alphanumeric'),
        phoneNumber: Joi.string().trim().regex(/^[\d]+$/, 'numbers'),
        email: Joi.string().trim().email(),
        firstName: Joi.string().trim().regex(/^[a-z ]+$/i, 'alphabetic'),
        lastName: Joi.string().trim().regex(/^[a-z ]+$/i, 'alphabetic')
    });

    return Joi.validate(contact, contactJoiSchema);
};
