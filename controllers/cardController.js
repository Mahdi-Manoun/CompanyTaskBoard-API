import mongoose from 'mongoose'
import Card from '../models/cardModel.js'
import Board from '../models/boardModel.js'
import Workspace from '../models/workspaceModel.js'
import User from '../models/userModel.js'


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

        const user = await User.findOne({ boards: board_id }).select('_id')

        console.log(user)

        const card = await Card.create({ title, description, board: board_id, user_id: user._id });

        board.cards.push(card)

        await board.save()

        return res.status(201).json(card);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




const getCards = async (req, res) => {
    const user_id = req.user._id

    try {
        const workspaces = await Workspace.find({ user_id }).select('_id')

        const workspaceIds = workspaces.map(workspace => workspace._id)

        const boards = await Board.find({ workspace: { $in: workspaceIds } })

        const boardIds = boards.map(board => board._id)

        const cards = await Card.find({ board: { $in: boardIds } })
            .select('title description')
            .populate({
                path: 'board',
                select: 'title',
                populate: {
                    path: 'workspace',
                    select: 'name'
                }
            })


        return res.status(200).json(cards)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}



const deleteCard = async (req, res) => {
    try {
        const { _id } = req.params;

        console.log(_id)

        // Check if the card ID is valid
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ error: 'Invalid card ID' });
        }

        // Find the card using the ID
        const card = await Card.findById(_id);


        // Check if the card exists
        if (!card) {
            return res.status(404).json({ error: 'Card not found.' });
        }

        const boardId = card.board; // Get the board ID from the card

        // Delete the card
        await Card.findByIdAndDelete(_id);

        // Remove the card ID from the cards array in the Board
        await Board.findByIdAndUpdate(boardId, { $pull: { cards: _id } });

        // Send a success response with the card title
        return res.status(200).json({ message: `"${card.title}" deleted successfully` });
    } catch (error) {
        return res.status(500).json({ error: 'Server Error' });
    }
}




const updateCard = async (req, res) => {
    const { card_id } = req.params;
    const { newTitle, newDescription } = req.body;

    // Check if the card ID is valid
    if (!mongoose.Types.ObjectId.isValid(card_id)) {
        return res.status(400).json({ error: 'Invalid card ID' });
    }

    try {
        // Find the card by its ID
        const card = await Card.findOne({ _id: card_id });

        // Return a 404 response if the card doesn't exist
        if (!card) return res.status(404).json({ error: 'Card not found.' });



        // Update the card's title and description if exists
        card.title = newTitle.trim() === '' ? card.title : newTitle.trim()
        card.description = newDescription ? newDescription.trim() : card.description

        await card.save(); // Save the updated card

        // Return a success message
        res.status(200).json({ message: `Card updated successfully: "${card.title}" - "${card.description}"` });
    } catch (error) {
        // Return a server error
        return res.status(500).json({ error: error.message });
    }
}



export {
    createCard,
    getCards,
    deleteCard,
    updateCard
}