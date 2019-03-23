module.exports = {
    dbStr: process.env.MONGODB || 'mongodb://localhost:27017/a-breakable-toy-experiment',
    port: process.env.PORT || 3005
};