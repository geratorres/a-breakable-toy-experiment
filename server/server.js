const mongoose = require('mongoose');
const app = require('./app');

const port = 3000;
const uri = 'mongodb://localhost:27017/a-breakable-toy-experiment';

mongoose.connect(uri, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', err => {
    console.error(err);
    console.error('Unable to connect');
});

db.on('open', () => {
    console.log('Connected to Mongodb');
    app.listen(port, () => {
        console.log('Servidor escuchando en el puerto: ' + port);
    });
});
