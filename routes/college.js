const express = require('express');
const router = express.Router();
const Colleges = require('../models/Colleges.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { collegeSchema } = require('../schema.js');

const validateColleges = (req, res, next) => {
    let { error } = collegeSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//index
router.get(
    '/',
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
router.get('/new', (req, res) => {
    res.render('colleges/new.ejs');
});

//show
router.get(
    '/:id',
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const college = await Colleges.findById(id);
        res.render('colleges/show.ejs', { college });
    })
);

//create
router.post(
    '/',
    validateColleges,
    wrapAsync(async (req, res) => {
        // console.log(req.body);

        const newCollege = new Colleges(req.body.college);
        await newCollege.save();
        res.redirect('/colleges');
        console.log('New college added:', newCollege);
    })
);

//edit
router.get(
    '/:id/edit',
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const college = await Colleges.findById(id);
        res.render('colleges/edit.ejs', { college });
    })
);
//update
router.put(
    '/:id',
    validateColleges,
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
router.delete(
    '/:id',
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let deleteCollege = await Colleges.findByIdAndDelete(id);
        console.log(deleteCollege);
        res.redirect('/colleges');
    })
);

module.exports = router;
