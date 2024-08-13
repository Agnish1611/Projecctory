import bcrypt from 'bcryptjs';
import jwt, { decode } from 'jsonwebtoken';

import UserRepository from "../repositories/userRepository.js";
import generateUniqueId from "generate-unique-id";

class UserService {
    constructor() {
        this.userRepo = new UserRepository();
    }

    async createUser(userData) {
        try {
            const { username, email } = userData;
            const uid = generateUniqueId({
                length: 8
            });
            
            userData = { ...userData, uniqueId: uid };

            const duplicateUsername = await this.userRepo.findUser({ username });

            if (duplicateUsername) {
                throw { error: 'Username already taken' };
            }

            const duplicateEmail = await this.userRepo.findUser({ email });

            if (duplicateEmail) {
                throw { error: 'Email already in use' };
            }

            const response = await this.userRepo.createUser(userData);
            return response; 
        } catch (error) {
            throw error;
        }
    }

    async loginUser(email, password) {
        try {
            const foundUser = await this.userRepo.findUser({ email });

            if (!foundUser) {
                return resizeBy.status(401).json({
                    msg: 'Unauthorized',
                    err: 'Email does not exist'
                });
            }

            const match = bcrypt.compareSync(password, foundUser.password);
            console.log(match);

            if (!match) {
                throw { err: 'Password is wrong' }
            }

            const accessToken = jwt.sign(
                {
                    'UserInfo': {
                        'id': foundUser._id,
                        'username': foundUser.username,
                        'uid': foundUser.uniqueId
                    }
                }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' }
            );

            const refreshToken = jwt.sign({
                'username': foundUser.username
            }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

            return { 
                accessToken, 
                refreshToken, 
                username: foundUser.username,
                uniqueId: foundUser.uniqueId,
                friends: foundUser.friends
            };
        } catch (error) {
            throw error;
        }
    }

    async refresh(decoded) {
        try {
            const foundUser = await this.userRepo.findUser({ username: decoded.username });
                    
            if (!foundUser) {
                throw { err: 'Unauthorized' }
            }

            return foundUser;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(userId, userData) {
        try {
            if (userData.username) {
                const duplicateUsername = await this.userRepo.findUser({ username: userData.username });

                if (duplicateUsername) {
                    throw { error: 'Username already taken' };
                }
            }

            if (userData.email) {
                const duplicateEmail = await this.userRepo.findUser({ email: userData.email });

                if (duplicateEmail) {
                    throw { error: 'Email already in use' };
                }
            }

            const response = await this.userRepo.updateUser(userId, userData);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async addFriend(friendId, userId) {
        try {
            if (friendId == userId) {
                throw { error: 'Friend id cannot be your own id' };
            }

            const user = await this.userRepo.findUser({ _id: userId });
            const friend = await this.userRepo.findUser({ uniqueId: friendId });

            if (user.friends.includes(friend._id)) {
                throw { error: 'This user is already your friend' };
            }

            user.friends.push(friend._id);
            friend.friends.push(user._id);
            await user.save()
            await friend.save();

            return { msg: `${user.username} is now friends with ${friend.username}`};
        } catch (error) {
            throw error;
        }
    }

    async removeFriend(friendId, userId) {
        try {
            if (friendId == userId) {
                throw { error: 'Friend id cannot be your own id' };
            }

            const user = await this.userRepo.findUser({ _id: userId });
            const friend = await this.userRepo.findUser({ uniqueId: friendId });

            if (!user.friends.includes(friend._id)) {
                throw { error: 'This user is not your friend' };
            }

            user.friends.splice(friend._id, 1);
            friend.friends.splice(user._id, 1);
            await user.save()
            await friend.save();

            return { msg: `${user.username} is no longer friends with ${friend.username}`};
        } catch (error) {
            throw error;
        }
    }
}

export default UserService;