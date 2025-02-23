import mongoose from 'mongoose';


// create a role schema
const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        default: 'user'
    }
});


// create a role model for schema
const Role = new mongoose.model('Role', roleSchema);

export default Role;