if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User.js');
const cookieParser = require('cookie-parser');

const home = require('./routes/home.js');
const collegeRouter = require('./routes/college');
const apicollegeRouter = require('./routes/api/apicollege.js');
const apiPyqRouter = require('./routes/api/apiPyq.js');
const userRouter = require('./routes/user.js');
const pyqRouter = require('./routes/pyqRoutes.js');
const groupRouter = require('./routes/whatsappGroup.js');
const apiGroupRouter = require('./routes/api/apigroup.js');
const notesRouter = require('./routes/notes.js');
const apiNotesRouter = require('./routes/api/apinotes.js');
const userRoutes = require('./routes/api/apiuser.js');
const authRoutes = require('./routes/api/apiauth.js');
const seniorRouter = require('./routes/senior.js');
const apiSeniorRouter = require('./routes/api/apisenior.js');
const storeRouter = require('./routes/store.js');
const apiStoreRouter = require('./routes/api/apistore.js');

const allowedOrigins = [
    'http://localhost:5173',
    'https://www.studentsenior.com',
    'https://studentsenior.com',
    'http://localhost:8080',
    'https://panel.studentsenior.com',
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                console.error(`Blocked by CORS: ${origin}`);
                return callback(null, false);
            }
        },
        credentials: true,
    })
);

// const DB_URL = 'mongodb://127.0.0.1:27017/CollegeResources';
const DB_URL = process.env.ATLAS_URL;

async function main() {
    try {
        await mongoose.connect(DB_URL);
        console.log('Connected to DB');
    } catch (err) {
        console.error('Failed to connect to DB', err);
    }
}
main();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

const store = MongoStore.create({
    mongoUrl: DB_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on('error', () => {
    console.log('error on mongo store ');
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 1 * 24 * 60 * 60 * 1000,
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

app.use('/', home);

//college routes
app.use('/colleges', collegeRouter);
app.use('/api/colleges', apicollegeRouter);
app.use('/', userRouter);
app.use('/pyqs', pyqRouter);
app.use('/api/pyqs', apiPyqRouter);
app.use('/whatsappgroup', groupRouter);
app.use('/api/whatsappgroup', apiGroupRouter);
app.use('/notes', notesRouter);
app.use('/api/notes', apiNotesRouter);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/seniors', seniorRouter);
app.use('/api/seniors', apiSeniorRouter);
app.use('/store', storeRouter);
app.use('/api/store', apiStoreRouter);

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
