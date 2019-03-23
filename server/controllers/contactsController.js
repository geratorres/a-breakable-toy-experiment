const { contactSchema: Contact } = require('../model/schemas');

module.exports = {
    readAll: async (ctx, next) => {
        try {
            // Should I validate this objects from query in therms of security?.
            const { page, limit, firstName, lastName } = ctx.query;

            const pager = {
                page: page || 1,
                //can i do this better?
                limit: isNaN(limit) ? 10 : Number(limit)
            };

            //TODO implement a filter
            const filter = { $and: [] };
            firstName && filter.$and.push({ firstName: new RegExp(firstName, 'i') });
            lastName && filter.$and.push({ lastName: new RegExp(lastName, 'i') });

            const result = await Contact.paginate(filter, pager);

            ctx.status = 200;
            ctx.body = {
                status: "success",
                data: {
                    contacts: result.docs
                }
            };

            return next();
        } catch (err) {
            ctx.status = err.status || 500;
            ctx.app.emit('error', err, ctx);

            return next();
        }
    },

    createOne: async (ctx, next) => {
        try {
            const { contact } = ctx.request.body;

            if (!contact) ctx.throw(400, "Contact not received");

            const { error, value } = Contact.joiValidate(contact);

            if (error) ctx.throw(400, error);

            const newContact = new Contact(value);

            const svdDoc = await newContact.save();

            ctx.status = 201;
            ctx.body = {
                status: "success",
                data: {
                    svdContact: svdDoc
                }
            };

            return next();
        } catch (err) {           // find better way to handle mongodb errors (codes 11000, etc) cant set yet a status code on mongo errors
            ctx.status = err.status || err.code == 11000 ? 400 : 500;
            ctx.app.emit('error', err, ctx);

            return next();
        };
    },

    readOne: async (ctx, next) => {
        try {
            const { id } = ctx.params;

            const doc = await Contact.findById(id);
            //See why in client is received 400 instead 404
            if (!doc) ctx.throw(404, 'Contact not found');

            ctx.status = 201;
            ctx.body = {
                status: "success",
                data: {
                    contact: doc
                }
            };

            return next();
        } catch (err) {               //catch mongo err codes for findById
            ctx.status = err.status || err.code == 11000 ? 400 : 500;
            ctx.app.emit('error', err, ctx);

            return next();
        };
    },

    deleteOne: async (ctx, next) => {
        try {
            const { id } = ctx.params;

            const deletedContact = await Contact.findOneAndDelete({ _id: id });
            //See why in client is received 400 instead 404
            if (!deletedContact) ctx.throw(404, 'Contact not found');

            ctx.status = 201;
            ctx.body = {
                status: "success",
                data: {
                    deletedContact
                }
            };

            return next();
        } catch (err) {               //catch mongo err codes for findByIdAndDelete
            ctx.status = err.status || err.code == 11000 ? 400 : 500;
            ctx.app.emit('error', err, ctx);

            return next();
        };
    },

    updateOne: async (ctx, next) => {
        try {
            const { contact } = ctx.request.body;
            const { id } = ctx.params;
            const options = {};

            if (!contact) ctx.throw(400, "Contact not received");

            const { error, value } = Contact.joiValidateToUpdate(contact);

            if (error) ctx.throw(400, error);

            const updatedDoc = await Contact.findByIdAndUpdate(id, { $set: value }, options);

            ctx.status = 201;
            ctx.body = {
                status: "success",
                data: {
                    updatedContact: updatedDoc,
                }
            };

            return next();
        } catch (err) {           // find better way to handle mongodb errors (codes 11000, etc) cant set yet a status code on mongo errors
            ctx.status = err.status || err.code == 11000 ? 400 : 500;
            ctx.app.emit('error', err, ctx);
            return next();
        };
    },
};