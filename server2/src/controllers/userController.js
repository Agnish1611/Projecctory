import UserService from "../services/userService.js";

const userService = new UserService();

const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userData = { username, email, password };
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

const updateUser = async (req, res) => {
    try {
        let userData = {};
        if (req.body?.username) userData = { username: req.body.username };
        if (req.body?.pasword) userData = { ...userData, password: req.body.password };
        if (req.body?.email) userData = { ...userData, email: req.body.email };

        if (!req.body?.username && !req.body?.pasword && !req.body?.email){
            return res.status(400).json({
                err: 'Missing any valid user data'
            });
        }

        const userId = req.params.id;

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
    updateUser,
    addFriend,
    removeFriend
}