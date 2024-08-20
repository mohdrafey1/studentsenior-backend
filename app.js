const express = require('express');
const app = express();
const mongoose = require('mongoose');

const Mongo_URL = 'mongodb://127.0.0.1:27017/college';

main()
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(Mongo_URL);
}

// Sample Route
app.get('/', (req, res) => {
    res.send('Backend is running');
});

app.listen(8080, () => {
    console.log('App is Listening on port 8080');
});
