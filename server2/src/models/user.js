import mongoose from 'mongoose';

import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    uniqueId: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    pfp: {
        type: String,
        default: 'boy-1',
        enum: {
            values: ['boy-1', 'boy-2', 'boy-3', 'girl-1', 'girl-2', 'girl-3', 'man-1', 'woman-1'],
            message: '{VALUE} is not supported'
        }
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true });

userSchema.pre('save', function (next) {
    const user = this;
    const encryptedPassword = bcrypt.hashSync(user.password, 10);
    user.password = encryptedPassword;

    next();
});

const User = mongoose.model('User', userSchema);
export default User;