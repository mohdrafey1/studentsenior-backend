const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DashboardUser = require('../../../models/DashboardUser');
const { errorHandler } = require('../../../utils/error');

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin123';
const MODERATOR_SECRET = process.env.MODERATOR_SECRET || 'mod123';

module.exports.signUp = async (req, res, next) => {
    const { email, name, college, password, secretCode } = req.body;

    const existingUser = await DashboardUser.findOne({ email });
    if (existingUser) return next(errorHandler(403, 'User already exists'));

    let role = 'Visitor';
    if (secretCode) {
        if (secretCode === ADMIN_SECRET) {
            role = 'Admin';
        } else if (secretCode === MODERATOR_SECRET) {
            role = 'Moderator';
        } else {
            return next(errorHandler(403, 'Invalid secret code'));
        }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new DashboardUser({
        email,
        name,
        college,
        password: hashedPassword,
        role,
    });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d',
        }
    );

    res.status(201).json({
        message: 'User registered successfully',
        token,
        role,
    });
};

module.exports.signIn = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await DashboardUser.findOne({ email });
    if (!user) return next(errorHandler(404, 'User not found'));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(errorHandler(401, 'Invalid credentials'));

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.status(200).json({
        message: 'Login successful, Welcome Back!',
        token,
        role: user.role,
    });
};
