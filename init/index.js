const mongoose = require('mongoose');
const collegedata = require('./collegedata.js');
const Colleges = require('../models/Colleges.js');

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

const initDB = async () => {
    await Colleges.deleteMany({});
    await Colleges.insertMany(collegedata.data);
    console.log('data initialized');
};

initDB();
