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
                    tasks: [task._id],
                    users: [task.user]
                }
            });

            await this.labelRepo.bulkCreate(newLabels);

            presentLabels.forEach(async (label) => {
                label.tasks.push(task._id);
                if (!label.users.includes(task.user)) label.users.push(task.user);
                await label.save();
            });

            return task;
        } catch (error) {
            console.log('error at service',error);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const response = await this.taskRepo.update(id, data);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getUpcoming(id) {
        try {
            let data = [];
            let dates = [];
            for (let i=0; i<7; i++) {
                let date = new Date(new Date().getTime() + 330*60000);
                date.setDate(date.getDate() + i);
                dates[i] = date.toISOString().split('T')[0];
            }
            data[0] = await this.taskRepo.getTasksByUser({user: id, date: dates[0]});
            data[1] = await this.taskRepo.getTasksByUser({user: id, date: dates[1]});
            data[2] = await this.taskRepo.getTasksByUser({user: id, date: dates[2]});
            data[3] = await this.taskRepo.getTasksByUser({user: id, date: dates[3]});
            data[4] = await this.taskRepo.getTasksByUser({user: id, date: dates[4]});
            data[5] = await this.taskRepo.getTasksByUser({user: id, date: dates[5]});
            data[6] = await this.taskRepo.getTasksByUser({user: id, date: dates[6]});

            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getTasksByUser(id, data) {
        try {
            let filter = { user: id };
            if (data.date) filter = { ...filter, date: data.date };
            if (data.completed == true) filter = { ...filter, completed: true};
            if (data.completed == false) filter = { ...filter, completed: false};
            if (data.label) filter = { ...filter, labels: { $in: [data.label] } };
            if (data.priority) filter = { ...filter, priority: data.priority};
            const tasks = await this.taskRepo.getTasksByUser(filter);
            return tasks;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const task = await this.taskRepo.getById(id);
            const labels = await this.labelRepo.findByName(task.labels);

            labels.forEach(async (label) => {
                label.users.pull(task.user);
                label.tasks.pull(task._id);
                await label.save();
                if (label.tasks.length == 0) {
                    await this.labelRepo.destroy(label._id);
                }
            });

            const response = await this.taskRepo.delete(id);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default TaskService;