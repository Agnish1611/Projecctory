import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;
const SALT = bcrypt.genSaltSync(Number(process.env.SALT));
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export {
    PORT,
    DB_URI,
    SALT,
    JWT_SECRET_KEY
}