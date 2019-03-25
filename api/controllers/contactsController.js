const { contactModel: Contact } = require('../models');

async function readAll(ctx, next) {
    const { pager, filter } = ctx;

    const result = await Contact.paginate(filter, pager);

    ctx.status = 200;
    ctx.body = {
        status: "success",
        contacts: result.docs,
        pager: {
            current: result.page,
            total: result.totalDocs,
            pageSize: result.limit
        }
    };

    await next();
}

async function createOne(ctx, next) {
    const { contact } = ctx.request.body;

    if (!contact) ctx.throw('error', 400, new Error('Contact not received'));

    const newContact = new Contact(contact);

    const svdDoc = await newContact.save();

    ctx.status = 201;
    ctx.body = {
        status: "success",
        contact: svdDoc
    };

    await next();
}

async function readOne(ctx, next) {
    const { id } = ctx.params;

    if (!id) ctx.throw('error', 400, new Error('Contact ID not received'));

    const doc = await Contact.findById(id);

    if (!doc) ctx.throw('error', 400, new Error('Contact not found'));

    ctx.status = 200;
    ctx.body = {
        status: "success",
        contact: doc
    };

    await next();
}

async function deleteOne(ctx, next) {
    const { id } = ctx.params;

    if (!id) ctx.throw('error', 400, new Error('Contact ID not received'));

    const deletedContact = await Contact.findByIdAndDelete(id);
    deletedContact || ctx.throw('error', 400, new Error('Contact not Found'));

    ctx.status = 200;
    ctx.body = {
        status: "success",
        contact: deletedContact
    };

    await next();
}

async function updateOne(ctx, next) {
    const { contact } = ctx.request.body;
    //maybe validate that id be a valid mongo id
    const { id } = ctx.params;

    if (!contact) ctx.throw('error', 400, new Error('Contact not received'));
    if (!id) ctx.throw('error', 400, new Error('Contact ID not received'));

    const updatedDoc = await Contact.findByIdAndUpdate(id, { $set: contact }, { new: true });

    ctx.status = 200;
    ctx.body = {
        status: "success",
        contact: updatedDoc,
    };

    await next();
}

module.exports = {
    readAll,
    createOne,
    readOne,
    updateOne,
    deleteOne
};