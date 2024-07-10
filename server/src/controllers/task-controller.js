import TaskService from "../services/task-service.js";

const taskService = new TaskService();

const createTask = async (req, res) => {
    try {
        const data = {
            title: req.body.title,
            description: req.body.description
        };
        const task = await taskService.create(data);
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

const getAllTasks = async (req, res) => {
    try {
        const tasks = await taskService.getAll();
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

const updateTask = async (req, res) => {
    try {
        const id = req.params.id;
        const data = {
            title: req.body.title,
            description: req.body.description
        };
        const task = await taskService.update(id, data);
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

const deleteTask = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await taskService.delete(id);
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

export {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask
}