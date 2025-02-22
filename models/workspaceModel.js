import mongoose from 'mongoose'


// create a workspace schema
const workspaceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        // unique: true,
        // default: 'TaskBoard Workspace'
    },
    boards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    }],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })


// create a workspace model for schema
const Workspace = new mongoose.model('Workspace', workspaceSchema)

export default Workspace