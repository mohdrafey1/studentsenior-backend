const Joi = require('joi');
const Colleges = require('./models/Colleges');

module.exports.collegeSchema = Joi.object({
    college: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        status: Joi.boolean(),
    }).required(),
});

module.exports.pyqSchema = Joi.object({
    subjectName: Joi.string().required(),
    subjectCode: Joi.string().required(),
    semester: Joi.string().required(),
    year: Joi.string().required(),
    branch: Joi.string().required(),
    course: Joi.string().required(),
    examType: Joi.string().required(),
    link: Joi.string().uri().required(),
    college: Joi.string().required(),
    status: Joi.boolean().default(true),
});

module.exports.groupSchema = Joi.object({
    title: Joi.string().required(),
    info: Joi.string().required(),
    domain: Joi.string().required(),
    link: Joi.string().uri().required(),
    college: Joi.string().required(),
    status: Joi.boolean().default(true),
});
