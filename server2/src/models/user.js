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