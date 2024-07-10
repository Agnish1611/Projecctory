import TaskRepo from "../repositories/task-repo.js";

class TaskService {
    constructor() {
        this.taskRepo = new TaskRepo();
    }

    async create(data) {
        try {
            const task = await this.taskRepo.create(data);
            return task;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getAllByUser(id) {
        try {
            const tasks = await this.taskRepo.getAllByUser(id);
            return tasks;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const task = await this.taskRepo.update(id, data);
            return task;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const task = await this.taskRepo.delete(id);
            return task;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default TaskService;