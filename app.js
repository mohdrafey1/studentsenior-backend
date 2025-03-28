const isProduction = process.env.NODE_ENV === 'production';

if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User.js');
const cookieParser = require('cookie-parser');

//dashboard router
const home = require('./routes/dashboard/home.route.js');
const toggleStatus = require('./routes/dashboard/toggleStatus.route.js');
const collegeRoutes = require('./routes/dashboard/college.route.js');
const userRouter = require('./routes/dashboard/user.route.js');
const notesRoutes = require('./routes/dashboard/notes.route.js');
const seniorRouter = require('./routes/dashboard/senior.routes.js');
const storeRouter = require('./routes/dashboard/store.route.js');
const communityRouter = require('./routes/dashboard/community.route.js');
const opportunityRouter = require('./routes/dashboard/opportunity.route.js');
const contactUsRouter = require('./routes/dashboard/contactus.route.js');
const pyqRouter = require('./routes/dashboard/pyq.routes.js');
const groupRouter = require('./routes/dashboard/group.route.js');
const courseRoutes = require('./routes/dashboard/branchcourse/course.route.js');
const branchRoutes = require('./routes/dashboard/branchcourse/branch.route.js');
const subjectRoutes = require('./routes/dashboard/subjects.route.js');
const transactionRoutes = require('./routes/dashboard/transaction.route.js');
const newPyqRoutes = require('./routes/dashboard/newPyq.route.js');
const lostFoundRoutes = require('./routes/dashboard/lostFound.route.js');

//new dashboard routes
const dashboardAuthRoutes = require('./routes/newdashboard/auth.routes.js');
const dashboardCollegeRoutes = require('./routes/newdashboard/college.routes.js');
const dashboardOtherStatsRoutes = require('./routes/newdashboard/otherStats.routes.js');
const dashboardUserRoutes = require('./routes/newdashboard/user.routes.js');
const dashboardResourceRoutes = require('./routes/newdashboard/resource.routes.js');
const dashboardTransactionRoutes = require('./routes/newdashboard/transaction.routes.js');
const dashboardStoreRoutes = require('./routes/newdashboard/store.routes.js');
const dashboardPyqRoutes = require('./routes/newdashboard/pyq.routes.js');
const dashboardNotesRoutes = require('./routes/newdashboard/notes.routes.js');
const dashboardSeniorRoutes = require('./routes/newdashboard/senior.route.js');
const dashboardCommunityRoutes = require('./routes/newdashboard/community.routes.js');
const dashboardLostFoundRoutes = require('./routes/newdashboard/lostfound.routes.js');
const dashboardGroupsRoutes = require('./routes/newdashboard/group.routes.js');
const dashboardOpportunitiesRoutes = require('./routes/newdashboard/opportunity.routes.js');
const dashboardCourseRoutes = require('./routes/newdashboard/course.routes.js');

//api router
const apicollegeRouter = require('./routes/api/college.api.js');
const apiPyqRouter = require('./routes/api/pyq.api.js');
const apiGroupRouter = require('./routes/api/group.api.js');
const notesApiRoutes = require('./routes/api/notes.api.js');
const userRoutes = require('./routes/api/user.api.js');
const authRoutes = require('./routes/api/auth.api.js');
const apiSeniorRouter = require('./routes/api/senior.api.js');
const apiStoreRouter = require('./routes/api/store.api.js');
const apiCommunityRouter = require('./routes/api/community.api.js');
const apiOpportunityRouter = require('./routes/api/opportunity.api.js');
const apiContactUsRouter = require('./routes/api/contactus.api.js');
const resourceApiRoutes = require('./routes/api/resource.api.js');
const s3PresignedRoutes = require('./routes/api/s3.presigned.api.js');
const cloudfrontsignurlRoutes = require('./routes/api/cloudfrontsignedurl.api.js');
const newPyqApiRoutes = require('./routes/api/newPyq.api.js');
const lostFoundApi = require('./routes/api/lostFound.api.js');
const phonePeApiRoutes = require('./routes/api/payment.route.js');

//course
const courseApiRoutes = require('./routes/course/course.routes.js');
const courseAuthRoutes = require('./routes/course/auth.routes.js');

const allowedOrigins = [
    'http://localhost:5173',
    'https://www.studentsenior.com',
    'https://studentsenior.com',
    'http://localhost:8080',
    'https://panel.studentsenior.com',
    'https://staging-studentsenior-backend.vercel.app',
    'https://staging-student-senior.vercel.app',
    'http://localhost:3000',
    'https://dashboard.studentsenior.com',
    'https://stagingcourse.studentsenior.com',
    'https://course.studentsenior.com',
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                console.error(`Blocked by CORS: ${origin}`);
                return callback(new Error('Not allowed by CORS'));
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

//frontend api routes
app.use('/api/colleges', apicollegeRouter);
app.use('/api/pyqs', apiPyqRouter);
app.use('/api/whatsappgroup', apiGroupRouter);
app.use('/api/notes', notesApiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/seniors', apiSeniorRouter);
app.use('/api/store', apiStoreRouter);
app.use('/api/community', apiCommunityRouter);
app.use('/api/opportunity', apiOpportunityRouter);
app.use('/api/contactus', apiContactUsRouter);
app.use('/api/resource', resourceApiRoutes);
app.use('/api/generate', s3PresignedRoutes);
app.use('/api/newpyq', newPyqApiRoutes);
app.use('/api/get-signed-url', cloudfrontsignurlRoutes);
app.use('/api/lostfound', lostFoundApi);
app.use('/api/phonepe', phonePeApiRoutes);

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

//dashboard routes
app.use('/', home);
app.use('/user', userRouter);
app.use('/whatsappgroup', groupRouter);
app.use('/colleges', collegeRoutes);
app.use('/pyqs', pyqRouter);
app.use('/notes', notesRoutes);
app.use('/seniors', seniorRouter);
app.use('/store', storeRouter);
app.use('/community', communityRouter);
app.use('/opportunity', opportunityRouter);
app.use('/toggle-status', toggleStatus);
app.use('/contactus', contactUsRouter);
app.use('/courses', courseRoutes);
app.use('/branches', branchRoutes);
app.use('/subjects', subjectRoutes);
app.use('/transactions', transactionRoutes);
app.use('/newpyqs', newPyqRoutes);
app.use('/lostfound', lostFoundRoutes);

//new dashboard route
app.use('/dashboard/auth', dashboardAuthRoutes);
app.use('/dashboard/college', dashboardCollegeRoutes);
app.use('/dashboard/stats', dashboardOtherStatsRoutes);
app.use('/dashboard/user', dashboardUserRoutes);
app.use('/dashboard/resource', dashboardResourceRoutes);
app.use('/dashboard/transactions', dashboardTransactionRoutes);
app.use('/dashboard/store', dashboardStoreRoutes);
app.use('/dashboard/pyqs', dashboardPyqRoutes);
app.use('/dashboard/notes', dashboardNotesRoutes);
app.use('/dashboard/seniors', dashboardSeniorRoutes);
app.use('/dashboard/community', dashboardCommunityRoutes);
app.use('/dashboard/lostfound', dashboardLostFoundRoutes);
app.use('/dashboard/groups', dashboardGroupsRoutes);
app.use('/dashboard/opportunity', dashboardOpportunitiesRoutes);
app.use('/dashboard/course', dashboardCourseRoutes);

//course
app.use('/courseapi/course', courseApiRoutes);
app.use('/courseapi/auth', courseAuthRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
    // console.log(err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});

app.listen(8080, () => {
    console.log('App is listening on port 8080');
});
