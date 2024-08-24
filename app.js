const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Colleges = require('./models/Colleges.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { collegeSchema } = require('./schema.js');
const cors = require('cors');

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

app.use(
    cors({
        origin: 'http://localhost:5173', // your frontend's URL
        credentials: true,
    })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.render('index.ejs');
});

const validateListing = (req, res, next) => {
    let { error } = collegeSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//college routes
//index
app.get(
    '/colleges',
    wrapAsync(async (req, res) => {
        try {
            const allColleges = await Colleges.find({});
            res.render('colleges/colleges', { allColleges });
        } catch (err) {
            console.error('Error fetching colleges:', err);
            res.status(500).send('Error fetching colleges');
        }
    })
);
//new
app.get('/colleges/new', (req, res) => {
    res.render('colleges/new.ejs');
});

//show
app.get(
    '/colleges/:id',
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const college = await Colleges.findById(id);
        res.render('colleges/show.ejs', { college });
    })
);

//create
app.post(
    '/colleges',
    validateListing,
    wrapAsync(async (req, res) => {
        // console.log(req.body);

        const newCollege = new Colleges(req.body.college);
        await newCollege.save();
        res.redirect('/colleges');
        console.log('New college added:', newCollege);
    })
);

//edit
app.get(
    '/colleges/:id/edit',
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const college = await Colleges.findById(id);
        res.render('colleges/edit.ejs', { college });
    })
);
//update
app.put(
    '/colleges/:id',
    validateListing,
    wrapAsync(async (req, res) => {
        if (!req.body.college) {
            throw new ExpressError(400, 'send valid data');
        }
        let { id } = req.params;
        await Colleges.findByIdAndUpdate(id, { ...req.body.college });
        res.redirect(`/colleges/${id}`);
    })
);

//delete
app.delete(
    '/colleges/:id',
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let deleteCollege = await Colleges.findByIdAndDelete(id);
        console.log(deleteCollege);
        res.redirect('/colleges');
    })
);

//api routes
// Fetch all colleges and send as JSON
app.get('/api/colleges', async (req, res) => {
    try {
        const allColleges = await Colleges.find({ status: true });
        res.json(allColleges);
    } catch (err) {
        console.error('Error fetching colleges:', err);
        res.status(500).send('Error fetching colleges');
    }
});

app.post(
    '/api/colleges',
    wrapAsync(async (req, res) => {
        const { name, location, description } = req.body;
        const newCollege = new Colleges({
            name,
            location,
            description,
        });
        await newCollege.save();
        res.json({ message: 'College submitted successfully.' });
    })
);

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'something went wrong' } = err;
    res.status(statusCode).render('error.ejs', { err });
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log('App is listening on port 8080');
});
