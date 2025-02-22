import mongoose from 'mongoose'


// create a board schema
const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    backgroundColor: {
        type: String,
        required: true
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
    }]
}, { timestamps: true })


// create a workspace model for schema
const Board = new mongoose.model('Board', boardSchema)

export default Board