import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        default: []
    },
    description: {
        type: String
    }
});


const Permission = new mongoose.model('Permission', permissionSchema);

export default Permission