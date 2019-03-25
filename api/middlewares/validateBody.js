const { contactValidation } = require('../util/validations');


module.exports = async (ctx, next) => {
    const { contact } = ctx.request.body;

    if (contact) {
        const { error, value } = contactValidation(contact);

        error && ctx.throw('error', 400, error);

        ctx.request.body.contact = value;
    }

    await next();
};