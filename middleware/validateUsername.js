import User from "../models/userModel.js"


const validateUsername = async (req, res, next) => {
    const { username } = req.body

    // check if username is provided
    if (!username || username.trim() === '') return res.status(400).json({ error: 'Username is required' })

    // check if username exists in db
    const exists = await User.findOne({ username })

    if (exists) return res.status(409).json({ error: 'Username already exists. Please choose a different one.' })

    next()
}


export default validateUsername