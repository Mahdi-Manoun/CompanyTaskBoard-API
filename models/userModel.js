import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'


// create a user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    // permissions: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Permission'
    // }],
    workspaces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace'
    }],
    boards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    }]
}, { timestamps: true });



// static signup method
userSchema.statics.signup = async function (username, password, roleId) {
    const exists = await this.findOne({ username })

    if (exists) throw Error('Username already taken')

    if (!username || !password) throw Error('All fields must be filled')

    if (!validator.isAlphanumeric(username)) throw Error('Username cannot contain spaces or special characters')

    if (!validator.isStrongPassword(password)) throw Error('Password is not strong enough')

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ username, password: hash, role: roleId })

    return user
}


// static login method
userSchema.statics.login = async function (username, password) {
    const user = await this.findOne({ username })

    if (!user) throw new Error('Incorrect username or password')

    if (!username || !password) throw Error('All fields must be filled')

    const match = await bcrypt.compare(password, user.password)

    if (!match) throw new Error('Incorrect username or password')

    return user
}


// userSchema.methods.isAdmin = function () {
//     return this.role.name === 'admin'
// }

// create a user model for schema
const User = new mongoose.model('User', userSchema);

export default User