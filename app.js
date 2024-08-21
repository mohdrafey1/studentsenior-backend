const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Colleges = require('./models/Colleges.js');
const path = require('path');

const Mongo_URL = 'mongodb://127.0.0.1:27017/CollegeResources';

async function main() {
    try {
        await mongoose.connect(Mongo_URL);
        console.log('Connected to DB');
    } catch (err) {
        console.error('Failed to connect to DB', err);
    }
}
main();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Backend is running');
});

//college route
app.get('/colleges', async (req, res) => {
    try {
        const allColleges = await Colleges.find({});
        res.render('colleges/colleges', { allColleges });
    } catch (err) {
        console.error('Error fetching colleges:', err);
        res.status(500).send('Error fetching colleges');
    }
});

app.get('/colleges/:id', async (req, res) => {
    let { id } = req.params;
    const college = await Colleges.findById(id);
    res.render('colleges/show.ejs', { college });
});

app.listen(8080, () => {
    console.log('App is listening on port 8080');
});
