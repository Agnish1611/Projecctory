import UserRepo from "../repositories/user-repo.js";

import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from "../config/env-config.js";

import bcrypt from 'bcryptjs';

class UserService {
    constructor() {
        this.userRepo = new UserRepo();
    }

    async signup(data) {
        try {
            const user = await this.userRepo.create(data);

            const token = this.#createToken(user);

            const response = {
                id: user._id,
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

    async login(data) {
        try {
            const user = await this.userRepo.findByEmail(data.email);
            if (!user) {
                throw {
                    err: 'no user found'
                }
            }

            const checkPassword = this.#comparePassword(data.password, user.password);
            if (!checkPassword) {
                throw {
                    err: 'wrong password'
                }
            }

            const token = this.#createToken(user);

            const response = {
                id: user._id,
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

    async authenticate(token) {
        try {
            const decodedData = jwt.verify(token, JWT_SECRET_KEY);
            return decodedData;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    #createToken(user) {
        try {
            const token = jwt.sign({
                id: user._id,
                username: user.username, 
                email: user.email
            }, JWT_SECRET_KEY, {expiresIn: '1d'});

            return token;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    #comparePassword(inputPass, encryptedPass) {
        try {
            const checkPassword = bcrypt.compareSync(inputPass, encryptedPass);
            return checkPassword;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default UserService;