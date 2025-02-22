import User from '../models/userModel.js'

const isAdmin = async (req, res, next) => {
    const user = req.user

    console.log(user)

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized: User not found.' })
    }

    const userWithRole = await User.findById(user._id).populate('role', 'name')

    if (userWithRole.role.name !== 'admin') {
        return res.status(403).json({ message: 'Only admin can perform this operation.' })
    }

    next()
}

export default isAdmin