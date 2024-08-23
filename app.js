const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Colleges = require('./models/Colleges.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

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
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.send('Backend is running');
});

//college routes
//index
app.get('/colleges', async (req, res) => {
    try {
        const allColleges = await Colleges.find({});
        res.render('colleges/colleges', { allColleges });
    } catch (err) {
        console.error('Error fetching colleges:', err);
        res.status(500).send('Error fetching colleges');
    }
});
//new
app.get('/colleges/new', (req, res) => {
    res.render('colleges/new.ejs');
});

//show
app.get('/colleges/:id', async (req, res) => {
    let { id } = req.params;
    const college = await Colleges.findById(id);
    res.render('colleges/show.ejs', { college });
});

app.post('/colleges', async (req, res) => {
    const newCollege = new Colleges(req.body.college);
    await newCollege.save();
    res.redirect('/colleges');
    console.log('New college added:', newCollege);
});

//edit
app.get('/colleges/:id/edit', async (req, res) => {
    let { id } = req.params;
    const college = await Colleges.findById(id);
    res.render('colleges/edit.ejs', { college });
});
//update
app.put('/colleges/:id', async (req, res) => {
    let { id } = req.params;
    await Colleges.findByIdAndUpdate(id, { ...req.body.college });
    res.redirect(`/colleges/${id}`);
});

//delete
app.delete('/colleges/:id', async (req, res) => {
    let { id } = req.params;
    let deleteCollege = await Colleges.findByIdAndDelete(id);
    console.log(deleteCollege);
    res.redirect('/colleges');
});

app.use((err, req, res, next) => {
    res.send('something Went Wrong');
});

app.listen(8080, () => {
    console.log('App is listening on port 8080');
});
