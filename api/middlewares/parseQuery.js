module.exports = async (ctx, next) => {
    const { current, pageSize, firstName, lastName } = ctx.query;

    //Antd design Pagination Labels
    const myCustomLabels = {
        totalDocs: 'total',
        limit: 'pageSize',
        page: 'current',
        totalPages: 'size',
        docs: 'data'
    };

    const pager = {
        current,
        pageSize: isNaN(pageSize) ? 10 : Number(pageSize),
        myCustomLabels
    };

    const filter = {};

    (firstName || lastName) && (filter.$and = []);
    firstName && filter.$and.push({ firstName: new RegExp(firstName, 'i') });
    lastName && filter.$and.push({ lastName: new RegExp(lastName, 'i') });

    ctx.pager = pager;
    ctx.filter = filter;

    await next();
}
