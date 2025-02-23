import mongoose from 'mongoose';
import Board from '../models/boardModel.js';
import User from '../models/userModel.js';
import Workspace from '../models/workspaceModel.js';
import uniqueString from 'unique-string';


// Middleware to require a workspace
const requireWorkspace = async (req, res, next) => {
    const { workspace_id } = req.params;

    const { boardTitle, backgroundColor, user_id } = req.body;

    let emptyFields = [];

    if (!boardTitle) {
        emptyFields.push('boardTitle');
    }

    if (!backgroundColor) {
        emptyFields.push('backgroundColor');
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: `Please fill in the following fields: ${emptyFields.join(', ')}` });
    }


    try {

        if (!workspace_id || !mongoose.Types.ObjectId.isValid(workspace_id)) {
            return res.status(400).json({ error: 'Invalid workspace ID' });
        }


        const workspaceExists = await Workspace.findById(workspace_id);

        if (!workspaceExists) {
            if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
                return res.status(400).json({ error: 'Invalid workspace and no valid user ID provided to create a new workspace.' });
            }

            const userExists = await User.findById(user_id);

            if (!userExists) {
                return res.status(404).json({ error: 'User not found.' });
            }


            const boardExists = await Board.findOne({ title: boardTitle, workspace: { $in: userExists.workspaces } });

            if (boardExists) {
                return res.status(400).json({ error: `Board with title "${boardTitle}" already exists for this user.` });
            }

            const newWorkspace = await Workspace.create({ title: `Workspace ${uniqueString().slice(0, 10)}`, user_id });

            const board = await Board.create({ title: boardTitle, backgroundColor, workspace: newWorkspace._id });


            newWorkspace.boards.push(board._id);

            await newWorkspace.save();

            userExists.workspaces.push(newWorkspace._id);

            userExists.boards.push(board._id);

            await userExists.save();

            return res.status(201).json({
                message: 'New workspace and board created',
                workspace: newWorkspace,
                board: board
            });
        }

        next();
    } catch (error) {
        console.error('Server error:', error.message); // Show error message for debugging
        return res.status(500).json({ error: 'Server error' });
    }
}


export default requireWorkspace;