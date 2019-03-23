const { contactSchema: Contact } = require('../model/schemas');

const index = async (ctx, next) => {
    try {
        // Should I validate this objects from query in therms of security?.
        const { page, limit, firstName, lastName } = ctx.query;
        const pager = { page, limit: Number(limit) };
        
        //TODO implement a filter
        const filter = {};

        const result = await Contact.paginate(filter, pager);

        ctx.status = 200;
        ctx.body = {
            contacts: result.docs,
        };

        return next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = { error: err.message }
        ctx.app.emit('error', err, ctx);
        return next();
    }
};

const create = async (ctx, next) => {
    try {
        const { contact } = ctx.request.body;

        if (!contact) ctx.throw(400, "Contact not received");

        const { error, value } = Contact.joiValidate(contact);

        if (error) ctx.throw(400, error);

        const newContact = new Contact(value);

        const svdDoc = await newContact.save();

        ctx.status = 201;
        ctx.body = {
            svdContact: svdDoc,
        };

        return next();
    } catch (err) {           // find better way to handle mongodb errors (codes 11000, etc) cant set yet a status code on mongo errors
        ctx.status = err.status || err.code == 11000 ? 400 : null || 500;
        ctx.body = { error: err.message }
        ctx.app.emit('error', err, ctx);
        return next();
    };
};

module.exports = { index, create };