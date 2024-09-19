const Client = require('../../models/Client.js');
const bcryptjs = require('bcryptjs');
const { errorHandler } = require('../../utils/error.js');
const jwt = require('jsonwebtoken');

module.exports.signup = async (req, res, next) => {
    const { username, email, password, phone, college } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new Client({
        username,
        email,
        phone,
        college,
        password: hashedPassword,
    });
    try {
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports.signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await Client.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User not found'));
        const validPassword = bcryptjs.compareSync(
            password,
            validUser.password
        );
        if (!validPassword) return next(errorHandler(401, 'wrong credentials'));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: hashedPassword, ...rest } = validUser._doc;
        const expiryDate = new Date(Date.now() + 2592000000); // 30 d
        res.cookie('access_token', token, {
            httpOnly: true,
            expires: expiryDate,
            secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
            sameSite: 'None', // Allows the cookie to be sent cross-origin
        })
            .status(200)
            .json(rest);
    } catch (error) {
        next(error);
    }
};

module.exports.google = async (req, res, next) => {
    try {
        const user = await Client.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: hashedPassword, ...rest } = user._doc;
            const expiryDate = new Date(Date.now() + 2592000000); // 30d
            res.cookie('access_token', token, {
                httpOnly: true,
                expires: expiryDate,
            })
                .status(200)
                .json(rest);
        } else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new Client({
                username:
                    req.body.name.split(' ').join('').toLowerCase() +
                    Math.random().toString(36).slice(-8),
                email: req.body.email,
                password: hashedPassword,
                profilePicture: req.body.photo,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: hashedPassword2, ...rest } = newUser._doc;
            const expiryDate = new Date(Date.now() + 2592000000);
            res.cookie('access_token', token, {
                httpOnly: true,
                expires: expiryDate,
                s,
            })
                .status(200)
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
};

module.exports.signout = (req, res) => {
    res.clearCookie('access_token').status(200).json('Signout success!');
};
