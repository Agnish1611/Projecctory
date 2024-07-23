import User from "../models/user.js";

class UserRepository {
    async createUser(userData) {
        try {
            const response = await User.create(userData);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async findUser(filter) {
        try {
            const response =await User.findOne(filter);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(userId, userData) {
        try {
            const response = await User.findByIdAndUpdate(userId, userData).lean();
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default UserRepository;