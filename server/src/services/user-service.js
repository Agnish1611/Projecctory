import UserRepo from "../repositories/user-repo.js";

import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from "../config/env-config.js";

class UserService {
    constructor() {
        this.userRepo = new UserRepo();
    }

    async signup(data) {
        try {
            const user = await this.userRepo.create(data);
            const token = this.#createToken(user);
            const response = {
                username: user.username,
                email: user.email,
                access: token
            }
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    #createToken(user) {
        try {
            const token = jwt.sign({
                username: user.username, 
                email: user.email, 
                password: user.password
            }, JWT_SECRET_KEY, {expiresIn: '1d'});

            return token;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default UserService;