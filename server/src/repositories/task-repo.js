import Task from "../models/task-model.js";

class TaskRepo {
    async create(data) {
        try {
            const task = await Task.create(data);
            return task;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const task = await Task.findByIdAndUpdate(id, data);
            return task;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getAll() {
        try {
            const tasks = await Task.find({});
            return tasks;
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