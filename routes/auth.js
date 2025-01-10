const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
const BlacklistedToken = require('../models/BlacklistedToken');

dotenv.config();

const router = express.Router();

function generateToken(user) {
    return jwt.sign({ id: user.id, username: user.username}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN 
    });
}

router.post('/register', async (req, res) => {
    const { username, password, email, fullname } = req.body;

    const existingUser = await User.findOne({ where: { username }});
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    //if new users
    try {
        const user = await User.create({ username, password, email, fullname });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to registering new user', error: err });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    //mencari pengguna berdasarkan username
    const user = await User.findOne({ where: { username } });
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = generateToken(user);

    res.json({
        message: 'Login successfully',
        token: token
    });
});

async function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(403).json({ message: 'Access denied, no token provided' });
    }

    try {
        const blacklistedToken = await BlacklistedToken.findOne({ where: { token } });
        if (blacklistedToken) {
            return res.status(403).json({ message: 'Token has been blacklisted, please login again!' });
            console.log('Token has been blacklisted.');
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }
    
            req.user = user;
            next();
        });
    } catch (err) {
        return res.status(500).json({ message: 'Error during authenticatoon', error: err });
    }
}

router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile data',
            user: user
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user data', error: err });
    }
});

router.post('/logout', authenticateToken, async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const user = await User.findByPk(req.user.id);

    const username = user.username
    const user_id = user.id

    try {
        await BlacklistedToken.create({ token, username, user_id });

        res.json({ message: 'Logout successful, token blacklisted' });
    } catch (err) {
        res.status(500).json({ message: 'Error logging out', error: err });
    }
});

module.exports = router;