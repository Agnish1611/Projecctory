import TaskRepo from "../repositories/task-repo.js";
import LabelRepo from '../repositories/label-repo.js';

class TaskService {
    constructor() {
        this.taskRepo = new TaskRepo();
        this.labelRepo = new LabelRepo();
    }

    async create(data) {
        try {
            const task = await this.taskRepo.create(data);
            let labels = data.labels;

            let presentLabels = await this.labelRepo.findByName(labels);
            let presentLabelTitles = presentLabels.map((label) => {
                return label.title;
            });

            let newLabels = labels.filter((label) => {
                return !presentLabelTitles.includes(label);
            });

            newLabels = newLabels.map((label) => {
                return {
                    title: label,
                    tasks: [task._id]
                }
            });

            await this.labelRepo.bulkCreate(newLabels);

            presentLabels.forEach((label) => {
                label.tasks.push(task._id);
                label.save();
            });

            return task;
        } catch (error) {
            console.log('error at service',error);
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

    async delete(id) {
        try {
            const response = await this.taskRepo.destroy(id);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default TaskService;