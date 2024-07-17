import Task from "../models/task-model.js";

class TaskRepo {
    async create(data) {
        try {
            const task = await Task.create(data);
            return task;
        } catch (error) {
            console.log('error at repo',error);
            throw error;
        }
    }

    async getTasksByUser(filter) {
        try {
            const tasks = await Task.find(filter).sort({priority: -1});
            return tasks;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async update(id, data){
        try {
            const response = await Task.findByIdAndUpdate(id, data);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getById(id) {
        try {
            const task = await Task.findById(id);
            return task;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const task = await Task.findByIdAndDelete(id);
            return task;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default TaskRepo;