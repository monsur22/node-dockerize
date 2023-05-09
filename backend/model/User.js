import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    confirmPassword: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                return v === this.password;
            },
            message: props => 'Passwords do not match'
        }
    },
    confirm_code: {
        type: String,
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
})
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})
const User = mongoose.model('User', UserSchema)
export default User