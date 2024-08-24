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

const colleges = require('./routes/college');
const apicollege = require('./routes/apicollege.js');

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

//college routes
app.use('/colleges', colleges);
app.use('/api/colleges', apicollege);

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
