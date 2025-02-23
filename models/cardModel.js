import mongoose from 'mongoose';


// create a card schema
const cardSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String,
        default: ''
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });


// create a card model for schema
const Card = new mongoose.model('Card', cardSchema);


export default Card;