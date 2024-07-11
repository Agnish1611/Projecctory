import TaskService from "../services/task-service.js";

class TaskController {
    constructor() {
        this.taskService = new TaskService();
    }

    async createTask(req, res) {
        try {
            const data = this.#parseUserData(req);
    
            const task = await this.taskService.create(data);
            return res.status(201).json({
                data: task,
                success: true,
                message: 'Successfully created a task',
                error: {}
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                data: {},
                success: false,
                message: 'Failed to create the task',
                error: error
            });
        }
    }

    async getAllTasks(req, res) {
        try {
            const id = req.params.id;
            const tasks = await this.taskService.getAllByUser(id);
            return res.status(200).json({
                data: tasks,
                success: true,
                message: 'Successfully fetched all tasks',
                error: {}
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                data: {},
                success: false,
                message: 'Failed to fetch the tasks',
                error: error
            });
        }
    }
    
    async updateTask(req, res) {
        try {
            const data = this.#parseUserData(req);
            const id = req.params.id;
            const task = await this.taskService.update(id, data);
            return res.status(200).json({
                data: task,
                success: true,
                message: 'Successfully updated the task',
                error: {}
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                data: {},
                success: false,
                message: 'Failed to update the task',
                error: error
            });
        }
    }
    
    async deleteTask(req, res) {
        try {
            const id = req.params.id;
            const task = await this.taskService.delete(id);
            return res.status(200).json({
                data: task,
                success: true,
                message: 'Successfully deleted the task',
                error: {}
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                data: {},
                success: false,
                message: 'Failed to delete the task',
                error: error
            });
        }
    }
    
    #parseUserData(req) {
        let data = {
            user: req.params.id,
            title: req.body.title,
            description: req.body.description,
        };
    
        if (req.body.priority) data = { ...data, priority: req.body.priority};
        if (req.body.labels) data = { ...data, labels: req.body.labels};
        if (req.body.date) data = { ...data, date: req.body.date};
    
        if (req.body.recurring) {
            let recurringData = { 
                isReurring: true, 
                recurringType: req.body.recurring,
                startDate: req.body.recurringStartDate,
                endDate: req.body.recurringendDate
            };
    
            data = { ...data, recurring: recurringData}
        }
    
        return data;
    }
}

export default TaskController;