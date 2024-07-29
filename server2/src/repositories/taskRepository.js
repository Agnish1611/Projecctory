import Task from "../models/task.js";

class TaskRepository {
    async createTask(taskData) {
        try {
            const response = await Task.create(taskData);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async bulkCreate(tasks) {
        try {
            const response = await Task.insertMany(tasks);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async findTasks(filter) {
        try {
            const response = await Task.find(filter);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateTask(taskId, taskData) {
        try {
            const response = await Task.findByIdAndUpdate(taskId, taskData).lean();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteTask(taskId) {
        try {
            const response = await Task.findByIdAndDelete(taskId).lean();
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default TaskRepository;