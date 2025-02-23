import mongoose from 'mongoose';
import Board from '../models/boardModel.js';
import Workspace from '../models/workspaceModel.js';
import User from '../models/userModel.js';



// create a new board
const createBoard = async (req, res) => {
    const { workspace_id } = req.params;
    const { boardTitle, backgroundColor } = req.body;

    try {
        const boardExists = await Board.findOne({ title: boardTitle, workspace: workspace_id });

        if (boardExists) {
            return res.status(400).json({ error: `Board with title "${boardTitle}" already exists.` });
        }

        const board = await Board.create({ title: boardTitle, backgroundColor, workspace: workspace_id });

        const workspace = await Workspace.findById(workspace_id);

        const userExists = await User.findOne({ workspaces: workspace_id });

        userExists.boards.push(board._id);

        await userExists.save();

        workspace.boards.push(board._id);

        await workspace.save();

        res.status(201).json(board);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


// get all boards
const getBoards = async (req, res) => {
    const user_id = req.user._id;

    try {
        const workspaces = await Workspace.find({ user_id }).select('_id');

        const workspaceIds = workspaces.map(workspace => workspace._id);

        const boards = await Board.find({ workspace: { $in: workspaceIds } })
            .sort({ createdAt: -1 })
            .select('title backgroundColor workspace');

        return res.status(200).json(boards);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}


// delete a board
const deleteBoard = async (req, res) => {
    try {
        const { title } = req.params;

        const { workspace_id } = req.body;

        if (!workspace_id || workspace_id.trim() === '') {
            return res.status(404).json({ error: 'Workspace ID is required.' });
        }

        const board = await Board.findOneAndDelete({ title, workspace: workspace_id });

        if (!board) {
            return res.status(404).json({ error: `Board with title ${title} not found.` });
        }

        await Workspace.updateOne(
            { boards: board._id },
            { $pull: { boards: board._id } }
        );

        return res.status(200).json({ message: `${board.title} deleted successfully` });
    } catch (error) {
        return res.status(500).json({ error: 'Server Error' });
    }
}


// update a board
const updateBoard = async (req, res) => {
    try {
        const { title } = req.params;

        const { newTitle, newBackgroundColor, workspace_id } = req.body;


        if (!workspace_id || workspace_id.trim() === '' || !mongoose.Types.ObjectId.isValid(workspace_id)) {
            return res.status(400).json({ error: 'Invalid workspace ID' });
        }

        const board = await Board.findOne({ title, workspace: workspace_id });

        if (!board) return res.status(404).json({ error: 'Board not found' });

        if (!newTitle || newTitle.trim() === '') return res.status(400).json({ error: 'newTitle parameter is required' });

        board.title = newTitle || board.title;
        board.backgroundColor = newBackgroundColor || board.backgroundColor;

        await board.save();

        return res.status(200).json({ message: `Board title updated successfully to ${newTitle} with ${newBackgroundColor} color` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server Error' });
    }
}


export {
    createBoard,
    getBoards,
    deleteBoard,
    updateBoard
}