const Joi = require('joi');

module.exports.collegeSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    status: Joi.boolean(),
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
    slug: Joi.string().required(),
    status: Joi.boolean().default(false),
});

module.exports.groupSchema = Joi.object({
    title: Joi.string().required(),
    info: Joi.string().required(),
    domain: Joi.string().required(),
    link: Joi.string().uri().required(),
    college: Joi.string().required(),
    status: Joi.boolean().default(false),
});

module.exports.notesSchema = Joi.object({
    subject: Joi.string().required(),
    title: Joi.string().required(),
    fileUrl: Joi.string().uri().required(),
    college: Joi.string().required(),
    status: Joi.boolean().default(false),
    owner: Joi.string().required(),
});

module.exports.seniorSchema = Joi.object({
    name: Joi.string().required(),
    domain: Joi.string().required(),
    branch: Joi.string(),
    whatsapp: Joi.string(),
    telegram: Joi.string(),
    year: Joi.string().required(),
    college: Joi.string().required(),
    status: Joi.boolean().default(false),
});

module.exports.storeSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    available: Joi.boolean().default(true),
    whatsapp: Joi.string(),
    telegram: Joi.string(),
    college: Joi.string().required(),
    status: Joi.boolean().default(false),
    image: Joi.string().allow('', null),
});

module.exports.postSchema = Joi.object({
    content: Joi.string().required(),
    isAnonymous: Joi.boolean().default(false),
});

module.exports.opportunitySchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    whatsapp: Joi.string(),
    email: Joi.string(),
    college: Joi.string().required(),
    status: Joi.boolean().default(false),
});

module.exports.lostFoundSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    college: Joi.string().required(),
    location: Joi.string().required(),
    type: Joi.string().required(),
    whatsapp: Joi.string().required(),
    imageUrl: Joi.string().allow('', null),
});
