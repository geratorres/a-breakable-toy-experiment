module.exports = async (ctx, next) => {
    const { page, pageSize, firstName, lastName, current } = ctx.query;

    const pager = {
        page: page || current,
        limit: isNaN(pageSize) ? 10 : Number(pageSize),
    };

    const filter = {};

    (firstName || lastName) && (filter.$and = []);
    firstName && filter.$and.push({ firstName: new RegExp(firstName, 'i') });
    lastName && filter.$and.push({ lastName: new RegExp(lastName, 'i') });

    ctx.pager = pager;
    ctx.filter = filter;

    await next();
}
