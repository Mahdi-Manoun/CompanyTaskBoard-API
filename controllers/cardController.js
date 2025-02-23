import mongoose from 'mongoose';
import Card from '../models/cardModel.js';
import Board from '../models/boardModel.js';
import Workspace from '../models/workspaceModel.js';
import User from '../models/userModel.js';


// create a new card
const createCard = async (req, res) => {
    const { title, description, board_id } = req.body;


    let emptyFields = [];

    if (!title || title.trim() === '') {
        emptyFields.push('title');
    }

    if (!board_id) {
        emptyFields.push('board_id');
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: `Fields "${emptyFields.join(', ')}" should not be empty or invalid` });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(board_id)) {
            return res.status(400).json({ error: 'Invalid board ID' });
        }

        const board = await Board.findById(board_id);

        if (!board) {
            return res.status(404).json({ error: 'Board not found.' });
        }

        const user = await User.findOne({ boards: board_id }).select('_id');

        const card = await Card.create({ title, description, board: board_id, user_id: user._id });

        board.cards.push(card);

        await board.save();

        return res.status(201).json(card);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};



// get all cards
const getCards = async (req, res) => {
    const user_id = req.user._id;

    try {
        const workspaces = await Workspace.find({ user_id }).select('_id');

        const workspaceIds = workspaces.map(workspace => workspace._id);

        const boards = await Board.find({ workspace: { $in: workspaceIds } });

        const boardIds = boards.map(board => board._id);

        const cards = await Card.find({ board: { $in: boardIds } })
            .select('title description')
            .populate({
                path: 'board',
                select: 'title',
                populate: {
                    path: 'workspace',
                    select: 'name'
                }
            });


        return res.status(200).json(cards);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}


// delete a card
const deleteCard = async (req, res) => {
    try {
        const { _id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ error: 'Invalid card ID' });
        }

        const card = await Card.findById(_id);
        if (!card) {
            return res.status(404).json({ error: 'Card not found.' });
        }

        const boardId = card.board;

        await Card.findByIdAndDelete(_id);

        // remove card reference from the board
        await Board.findByIdAndUpdate(boardId, { $pull: { cards: _id } });

        return res.status(200).json({ message: `"${card.title}" deleted successfully` });
    } catch (error) {
        return res.status(500).json({ error: 'Server Error' });
    }
}


// update a card's title and description
const updateCard = async (req, res) => {
    const { _id } = req.params;
    const { newTitle, newDescription } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ error: 'Invalid card ID' });
    }

    try {
        const card = await Card.findOne({ _id });

        if (!card) return res.status(404).json({ error: 'Card not found.' });



        // update only if new values are provided
        card.title = newTitle.trim() === '' ? card.title : newTitle.trim();
        card.description = newDescription ? newDescription.trim() : card.description;

        await card.save();

        return res.status(200).json({ message: `Card updated successfully: "${card.title}" - "${card.description}"` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


export {
    createCard,
    getCards,
    deleteCard,
    updateCard
}