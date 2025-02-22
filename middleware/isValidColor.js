import Color from 'color'

// Middleware to validate the backgroundColor in the request body
const isValidColor = (req, res, next) => {
    const { backgroundColor } = req.body

    if (!backgroundColor) {
        return res.status(400).json({ error: 'Background color is required' })
    }

    try {
        Color(backgroundColor)

        next()
    } catch (error) {
        return res.status(400).json({ error: 'Invalid color provided' })
    }
}

export default isValidColor