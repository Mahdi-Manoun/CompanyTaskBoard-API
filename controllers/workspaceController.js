import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Workspace from '../models/workspaceModel.js';


// create a new workspace
const createWorkspace = async (req, res) => {
    const { title, user_id } = req.body;

    try {
        const userExists = await User.findById(user_id);

        const workspace = await Workspace.create({ title, user_id });

        userExists.workspaces.push(workspace._id);

        userExists.save();

        return res.status(201).json(workspace);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}


// get all workspaces
const getWorkspaces = async (req, res) => {
    const user_id = req.user._id;

    const workspace = await Workspace.find({ user_id })
        .sort({ createdAt: -1 })
        .select('title');

    return res.status(200).json(workspace);
}


// get a single workspace
const getWorkspace = async (req, res) => {
    try {
        const { title } = req.params;

        // Check if title is provided and not empty
        if (!title || title.trim() === '') return res.status(400).json({ error: 'Name parameter is required' });

        // Find a workspace by title
        const workspace = await Workspace.findOne({ title });

        if (!workspace) return res.status(404).json({ error: 'No such Workspace found' });

        return res.status(200).json(workspace);
    } catch (error) {
        return res.status(500).json({ error: 'Server Error' });
    }
}

// delete a workspace
const deleteWorkspace = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(404).json({ error: 'No such ID found' });

        const workspace = await Workspace.findByIdAndDelete(id);

        if (!workspace) return res.status(404).json({ error: 'Workspace not found' });

        const userId = workspace.user_id;

        await User.findByIdAndDelete(userId, { $pull: { workspaces: workspace._id } });

        return res.status(200).json({ message: `${workspace.title} deleted successfully` });
    } catch (error) {
        return res.status(500).json({ error: 'Server Error' });
    }
}


// update a workspace
const updateWorkspace = async (req, res) => {
    try {
        const { title, newTitle, user_id } = req.body;


        const workspace = await Workspace.findOne({ title, user_id });

        if (!workspace) {
            return res.status(404).json({ error: 'Workspace not found for this user' });
        }

        workspace.title = newTitle;

        await workspace.save();

        return res.status(200).json({ message: `Workspace updated successfully to ${newTitle}` });
    } catch (error) {
        return res.status(500).json({ error: 'Server Error' });
    }
}


// assign a user to a workspace
const assignUserIdToWorkspace = async (req, res) => {
    try {
        const { user_id, workspaceTitle } = req.body;

        if (!user_id || !mongoose.Types.ObjectId.isValid(user_id.trim())) {
            return res.status(400).json({ error: 'user_id cannot be invalid or empty.' });
        }

        if (!workspaceTitle || workspaceTitle.trim() === '') {
            return res.status(400).json({ error: 'workspaceTitle is required.' });
        }

        const user = await User.findById(user_id);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const workspace = await Workspace.findOne({ title: workspaceTitle });

        if (!workspace) {
            return res.status(404).json({ error: 'Workspace not found.' });
        }

        workspace.user_id = user_id;

        await workspace.save();

        return res.status(200).json({ message: 'User added successfully.' });

    } catch (error) {
        return res.status(500).json({ error: 'Server Error' });
    }
}


export {
    createWorkspace,
    getWorkspaces,
    getWorkspace,
    deleteWorkspace,
    updateWorkspace,
    assignUserIdToWorkspace
}