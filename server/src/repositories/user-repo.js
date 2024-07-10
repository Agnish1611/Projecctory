import User from "../models/user-model.js";

class UserRepo {
    async create(data) {
        try {
            const user = await User.create(data);
            return user;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default UserRepo;