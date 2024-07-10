import UserService from "../services/user-service.js";

const userService = new UserService();

const signup = async (req, res) => {
    try {
        const userData = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };
        const data = await userService.signup(userData);
        return res.status(201).json({
            data: data,
            success: true,
            message: 'Successfully signed up',
            error: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to sign up',
            error: error
        });
    }
}

const login = async (req, res) => {
    try {
        const loginData = {
            email: req.body.email,
            password: req.body.password
        };
        const data = await userService.login(loginData);
        return res.status(200).json({
            data: data,
            success: true,
            message: 'Successfully logged in',
            error: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to login',
            error: error
        });
    }
}

export {
    signup,
    login
}