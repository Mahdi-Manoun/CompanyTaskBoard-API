import User from '../models/userModel.js';

// Middleware to check if the username is valid or not
const validateUsername = async (req, res, next) => {
    const { username } = req.body;

    if (!username || username.trim() === '') return res.status(400).json({ error: 'Username is required' });

    const exists = await User.findOne({ username });

    if (exists) return res.status(409).json({ error: 'Username already exists. Please choose a different one.' });

    next();
}


export default validateUsername;