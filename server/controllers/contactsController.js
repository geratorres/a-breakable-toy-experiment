const Contact = require('../model/schemas/contactSchema');

const get = async (ctx, next) => {
    const { page } = ctx.params;

    const initialPage = 1; //Todo put this in a Consts File

    const options = {
        page: typeof Number(page) === Number ? number : initialPage,
        limit: 10,
        //offset// Todo ;Ask about wtf this is for
    };

    return Contact.paginate({}, options).then(result => {
        ctx.status = 200;
        ctx.body = {
            data: result.docs,
            pager: {
                initialPage,
                currentPage: options.page,
                pageSize: options.limit
            },
            error: null
        };

        next();
    }).catch(err => {
        console.log(err);
        next(err);
    });
};

const post = async (ctx, next) => {
    console.log(ctx);
    const { contact } = ctx.request.body;
    const contactDoc = new Contact(contact);

    return contactDoc.save().then(svdDoc => {
        console.log('svdDoc: ', svdDoc);
        ctx.status = 201;
        ctx.body = {
            data: svdDoc
        };

        next();
    }).catch(err => {
        ctx.status = 404;
        ctx.body = {
            err,
            data: undefined
        };
        next(err);
    });
};



module.exports = { get, post };