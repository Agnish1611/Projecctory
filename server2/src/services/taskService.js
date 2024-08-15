import TaskRepository from "../repositories/taskRepository.js";
import UserRepository from "../repositories/userRepository.js";

class TaskService {
    constructor() {
        this.taskRepo = new TaskRepository();
        this.userRepo = new UserRepository();
    }

    async createTask(taskData) {
        try {
            if (taskData.recurring?.type) {
                const start = new Date(taskData.date.substring(3, 5)+'-'+taskData.date.substring(0, 2)+'-'+taskData.date.substring(6, 10));
                const end = new Date(taskData.recurring.endDate.substring(3, 5)+'-'+taskData.recurring.endDate.substring(0, 2)+'-'+taskData.recurring.endDate.substring(6, 10));

                let tasks = [];
                let i=start;
                while (i<end) {
                    tasks.push({
                        ...taskData,
                        date: this.#toDateString(i)
                    });
                    i.setDate(i.getDate()+1+Number(taskData.recurring.type));
                }
                
                const res = this.taskRepo.bulkCreate(tasks);
                return res;
            }
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

    async getSkippedTasks(user) {
        try {
            const date = new Date();
            const tasks = await this.taskRepo.findTasks({completed: false, user: user});
            const newTasks = tasks.filter((task) => {
                return (
                    Number(task.date.substring(6, 10)) < new Date().getFullYear() || 
                    Number(task.date.substring(3, 5)) < new Date().getMonth()+1 ||
                    (Number(task.date.substring(0, 2)) < new Date().getDate() && Number(task.date.substring(3, 5)) == new Date().getMonth()+1 && Number(task.date.substring(6, 10)) == new Date().getFullYear())
                )
            });
            console.log(newTasks);
            return newTasks;
        } catch (error) {
            throw error;
        }
    }

    #toDateString(date) {
        const day = date.getDate();
        const month = date.getMonth()+1;
        const year = date.getFullYear();

        const dateString = (day>9 ? day+'' : '0'+day) + '-' + (month>9 ? month+'' : '0'+month) + '-' + year;
        return dateString;
    }
}

export default TaskService;