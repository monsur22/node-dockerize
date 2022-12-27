import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirm_code: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
})

const User = mongoose.model('User', UserSchema)
export default User