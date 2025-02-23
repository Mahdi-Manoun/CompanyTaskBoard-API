import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';


// Middleware function to verify the user is authenticated
const requireAuth = async (req, res, next) => {
    // get the token from user
    const { authorization } = req.headers;

    if (!authorization) return res.status(401).json({ error: 'Authorization token required' });

    const token = authorization.split(' ')[1];

    try {
        // token verification
        const { _id } = jwt.verify(token, process.env.SECRET);

        req.user = await User.findById(_id)
            .select('_id')
            .populate('role', 'name');

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Request is not authorized' });
    }
}


export default requireAuth;