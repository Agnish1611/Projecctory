import UserService from "../services/user-service.js";

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    async signup(req, res) {
        try {
            const userData = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            };
            const data = await this.userService.signup(userData);
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
    
    async login(req, res) {
        try {
            const loginData = {
                email: req.body.email,
                password: req.body.password
            };
            const data = await this.userService.login(loginData);
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
    
    async authenticate(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const data = await this.userService.authenticate(token);
            return res.status(200).json({
                data: data,
                success: true,
                message: 'Authenticated successfully',
                error: {}
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                data: {},
                success: false,
                message: 'Unauthorized',
                error: error
            });
        }
    }
}

export default UserController;