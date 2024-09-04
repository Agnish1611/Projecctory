import jwt from 'jsonwebtoken';

import UserService from "../services/userService.js";

const userService = new UserService();

const createUser = async (req, res) => {
    try {
        const { username, email, password, pfp } = req.body;
        const userData = { username, email, password, pfp };
        const response = await userService.createUser(userData);

        return res.status(201).json({
            msg: 'New user was created',
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Something went wrong',
            err: error,
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { accessToken, refreshToken, username, friends, uniqueId, pfp } = await userService.loginUser(email, password);

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7*24*60*60*1000
        });

        return res.status(200).json({
            msg: 'Successfully logged in',
            accessToken,
            username,
            uniqueId,
            email,
            friends,
            pfp
        });
    } catch (error) {
        if (error.err) {
            return res.status(401).json({
                msg: 'Unauthorized',
                err: error.err
            });
        }
        return res.status(500).json({
            msg: 'Something went wrong',
            err: error,
        });
    }
}

const refresh = async (req, res) => {
    try {
        const cookies = req.cookies;

        if (!cookies?.jwt) {
            return res.status(401).json({
                msg: 'Unauthorized',
                err: 'Cookie is invalid'
            });
        }

        const refreshToken = cookies.jwt;

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) {
                    throw { err: 'Forbidden' }
                }

                const foundUser = await userService.refresh(decoded);

                const accessToken = jwt.sign(
                    {
                        'UserInfo': {
                            'id': foundUser._id,
                            'username': foundUser.username,
                            'uid': foundUser.uniqueId
                        }
                    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' }
                );

                return res.status(200).json({
                    msg: 'Token refreshed',
                    accessToken,
                    'id': foundUser._id,
                    'username': foundUser.username,
                    'email': foundUser.email,
                    'uniqueId': foundUser.uniqueId,
                    'friends': foundUser.friends,
                    'pfp': foundUser.pfp
                });
            }
        );
    } catch (error) {
        return res.status(500).json({
            msg: 'Something went wrong',
            err: error,
        });
    }
}

const logout = async (req, res) => {
    try {
        const cookies = req.cookies;

        if (!cookies?.jwt) {
            return res.status(204).json({
                msg: 'Invalid cookie'
            });
        }

        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true
        });

        return res.status(200).json({
            msg: 'Successfully logged out'
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Something went wrong',
            err: error,
        });
    }
}

const updateUser = async (req, res) => {
    try {
        let userData = {};
        if (req.body?.username) userData = { username: req.body.username };
        if (req.body?.pasword) userData = { ...userData, password: req.body.password };
        if (req.body?.email) userData = { ...userData, email: req.body.email };
        if (req.body?.firstName) userData = { ...userData, firstName: req.body.firstName };
        if (req.body?.lastName) userData = { ...userData, lastName: req.body.lastName };
        if (req.body?.pfp) userData = { ...userData, pfp: req.body.pfp };

        if (!req.body?.username && !req.body?.pasword && !req.body?.email && !req.body?.firstName && !req.body?.lastName && !req.body?.pfp){
            return res.status(400).json({
                err: 'Missing any valid user data'
            });
        }

        const userId = req.user;

        const response = await userService.updateUser(userId, userData);

        return res.status(200).json({
            msg: 'User was updated',
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Something went wrong',
            err: error,
        });
    }
}

const addFriend = async (req, res) => {
    try {
        const friendId = req.params.id;
        const userId = req.body.id;

        const response = await userService.addFriend(friendId, userId);
        return res.status(200).json({
            msg: 'Friend was added',
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Something went wrong',
            err: error,
        });
    }
}

const removeFriend = async (req, res) => {
    try {
        const friendId = req.params.id;
        const userId = req.body.id;

        const response = await userService.removeFriend(friendId, userId);
        return res.status(200).json({
            msg: 'Friend was removed',
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Something went wrong',
            err: error,
        });
    }
}

export {
    createUser,
    loginUser,
    refresh,
    logout,
    updateUser,
    addFriend,
    removeFriend
}