import mongoose from "mongoose"
import User from "../models/userModel.js"
import Workspace from "../models/workspaceModel.js"

const validateWorkspaceTitle = async (req, res, next) => {
    const { title, newTitle, user_id } = req.body


    if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
        return res.status(400).json({ error: 'User ID is missing or invalid' })
    }

    const userExists = await User.findById(user_id)

    if (!userExists) {
        return res.status(404).json({ error: 'User not found.' })
    }

    console.log(userExists)

    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Workspace title is required' })
    }

    if (req.method === 'POST') {
        const workspaceExists = await Workspace.findOne({ title, user_id: userExists._id })

        if (workspaceExists) {
            return res.status(400).json({ error: `Workspace with title "${title}" already exists for this user.` })
        }
    }


    if (req.method === 'PATCH') {
        if (!newTitle || newTitle.trim() === '') {
            return res.status(400).json({ error: 'New Workspace title is required' })
        }

        const workspaceExists = await Workspace.findOne({ title: newTitle, user_id: userExists._id })

        if (workspaceExists) {
            return res.status(400).json({ error: `Workspace with title "${newTitle}" already exists for this user.` })
        }
    }

    next()
}


export default validateWorkspaceTitle