import mongoose from 'mongoose'

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        default: 'user'
    },
    // permissions: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Permission'
    // }]
});



const Role = new mongoose.model('Role', roleSchema);

export default Role