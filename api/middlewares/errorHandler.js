module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = ctx.status || err.status || err.code == 11000 ? 400 : 500;
        console.error(err);
        // check if ctx would not send on arguments in some situations
        ctx.body = {
            status: "failure",
            error: ctx.status == 500 ? 'Internal Server Error' : err.message
        }
    }
}
