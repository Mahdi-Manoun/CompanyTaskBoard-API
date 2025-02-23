// Middleware function to prevent users from modifying their role or permissions
const preventRoleChange = (req, res, next) => {
    if (req.body.role || req.body.permissions) {
        return res.status(403).json({ error: 'You are not allowed to modify your role or permissions.' });
    }

    next();
}

export default preventRoleChange;