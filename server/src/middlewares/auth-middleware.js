import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/env-config.js";

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, JWT_SECRET_KEY);
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: 'unauthorized'
        });
    }
}

export {
    authenticate
}