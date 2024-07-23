import TaskRepository from "../repositories/taskRepository.js";
import UserRepository from "../repositories/userRepository.js";

class TaskService {
    constructor() {
        this.taskRepo = new TaskRepository();
        this.userRepo = new UserRepository();
    }

    async createTask(taskData) {
        try {
            const response = await this.taskRepo.createTask(taskData);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getTasks(filter) {
        try {
            const response = await this.taskRepo.findTasks(filter);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateTask(taskId, taskData) {
        try {
            const response = await this.taskRepo.updateTask(taskId, taskData);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteTask(taskId) {
        try {
            const response = await this.taskRepo.deleteTask(taskId);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async assignTask(taskId, userId, assigneeId) {
        try {
            const task = await this.taskRepo.findTasks({ _id: taskId });
            const user = await this.userRepo.findUser({ _id: userId });
            const assignee = await this.userRepo.findUser({ _id: assigneeId });

            task[0].user = userId;
            task[0].assignee = assigneeId;
            await task[0].save();

            if (userId == assigneeId) {
                return { msg: `Task was assigned by ${user.username} to themselves` };
            } else {
                return { msg: `Task was assigned by ${assignee.username} to ${user.username}` };
            }
        } catch (error) {
            throw error;
        }
    }
}

export default TaskService;