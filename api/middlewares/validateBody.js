const { contactValidation } = require('../util/validations');


module.exports = async (ctx, next) => {
    const { contact } = ctx.request.body;

    if (contact) {
        const { err, value } = contactValidation(contact);

        err && ctx.throw('error', 400, err);

        ctx.request.body.contact = value;
    }

    await next();
};