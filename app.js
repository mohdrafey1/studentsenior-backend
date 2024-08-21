const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Colleges = require('./models/Colleges.js');
const path = require('path');

const Mongo_URL = 'mongodb://127.0.0.1:27017/CollegeResources';

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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.send('Backend is running');
});

app.get('/colleges', async (req, res) => {
    let allColleges = await Colleges.find({});
    res.render('/colleges/colleges.ejs', { allColleges });
});

app.listen(8080, () => {
    console.log('App is Listening on port 8080');
});
