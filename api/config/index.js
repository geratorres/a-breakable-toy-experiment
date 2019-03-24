module.exports = {
    dbStr: process.env.MONGODB || 'mongodb://localhost:27017/breakable-toy',
    port: process.env.PORT || 3005
};