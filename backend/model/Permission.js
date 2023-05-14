import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
    url: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Url',
        required: false
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: false
    }
});

const Permission = mongoose.model('Permission', permissionSchema);

export default  Permission;
