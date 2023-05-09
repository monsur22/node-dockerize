import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let PasswordResetSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
})

const PasswordReset = mongoose.model('PasswordReset', PasswordResetSchema)
export default PasswordReset