const http = require('http');
const { port, dbStr } = require('./config');
const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect(dbStr, { useNewUrlParser: true, useCreateIndex: true });
const db = mongoose.connection;

db.on('error', err => {
    console.error(err);
    console.error('Unable to connect');
});

db.on('open', () => {
    console.log('Connected to Mongodb');
    http.createServer(app.callback()).listen(port, () => {
        console.log('listening on port: ' + port);
    });
});
