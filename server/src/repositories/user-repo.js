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

    async findByEmail(email) {
        try {
            const user = await User.findOne({email: email});
            return user;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async findByUsername(username) {
        try {
            const user = await User.findOne({username: username}).exec();
            return user;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default UserRepo;