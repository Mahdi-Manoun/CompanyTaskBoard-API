import User from '../models/userModel.js';
import Role from '../models/roleModel.js';
import jwt from 'jsonwebtoken';
import validator from 'validator';


// create a token for logged in user
const createToken = (_id) => jwt.sign({ _id }, process.env.SECRET, { expiresIn: '1d' });


// create a new user
const signupUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userRole = await Role.findOne({ name: 'user' });

        const user = await User.signup(username, password, userRole._id);

        const token = createToken(user._id);

        console.log({ username, token });

        return res.status(201).json({ username, token });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

}


// user login
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);

        const token = createToken(user._id);

        console.log({ username, token });

        return res.status(200).json({ username, token });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}


// edit user function
const updateUser = async (req, res) => {
    const { username } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!validator.isAlphanumeric(username)) {
        return res.status(400).json({ error: 'Username cannot contain spaces or special characters' });
    }

    user.username = username;

    await user.save();

    return res.status(200).json(user);
}


export {
    signupUser,
    loginUser,
    updateUser
}