import mongoose from 'mongoose';

import bcrypt from 'bcrypt';
import { SALT } from '../config/env-config';

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
    email: {
        type: String,
        required: true
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
}, {timestamps: true});

userSchema.pre('save', function (next) {
    const user = this;
    const encryptedPassword = bcrypt.hashSync(user.password, SALT);
    user.password = encryptedPassword;
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;