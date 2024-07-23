import TaskService from "../services/taskService.js";

const taskService = new TaskService();

const createTask = async (req, res) => {
    try {
        const { description, date, time } = req.body;
        let taskData = { description, date, time };

        if (req.body?.user) taskData = { ...taskData, user: req.body.user };
        if (req.body?.labels.length) taskData = { ...taskData, labels: req.body.labels };
        if (req.body?.priority) taskData = { ...taskData, priority: req.body.priority };
        if (req.body?.assignee) taskData = { ...taskData, assignee: req.body.assignee };
        if (req.body?.recurring) {
            const { type, startDate, endDate } = req.body.recurring;
            const recurring = { type, startDate, endDate };
            taskData = { ...taskData, recurring };
        }

        const response = await taskService.createTask(taskData);
        return res.status(201).json({
            msg: 'Created a new task',
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Something went wrong',
            err: error
        });
    }
}

const getTasks = async (req, res) => {
    try {
        let filter = {};
        if (req.query?.user) filter = { ...filter, user: req.query.user };
        if (req.query?.date) filter = { ...filter, date: req.query.date };
        if (req.query?.priority) filter = { ...filter, priority: req.query.priority };
        if (req.query?.completed == 'true') filter = { ...filter, completed: true };
        else if (req.query?.completed == 'false') filter = { ...filter, completed: false };
        if (req.query?.label) filter = { ...filter, labels: {$in: [req.query.label] } };

        const response = await taskService.getTasks(filter);
        return res.status(200).json({
            msg: 'Fetched the tasks',
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Something went wrong',
            err: error
        });
    }
}

const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        let taskData = {};
        if (req.body?.user) taskData = { ...taskData, user: req.body.user };
        if (req.body?.completed) taskData = { ...taskData, completed: req.body.completed };
        if (req.body?.description) taskData = { ...taskData, description: req.body.description };
        if (req.body?.date) taskData = { ...taskData, date: req.body.date };
        if (req.body?.labels?.length) taskData = { ...taskData, labels: req.body.labels };
        if (req.body?.priority) taskData = { ...taskData, priority: req.body.priority };
        if (req.body?.assignee) taskData = { ...taskData, assignee: req.body.assignee };
        if (req.body?.recurring) {
            const { type, startDate, endDate } = req.body.recurring;
            const recurring = { type, startDate, endDate };
            taskData = { ...taskData, recurring };
        }

        if (!req.body?.user && !req.body?.description && !req.body?.date && !req.body?.labels?.length && !req.body?.priority && !req.body?.assignee && !req.body?.recurring?.type && !req.body.completed) {
            return res.status(400).json({
                err: 'Missing any valid user data'
            });
        }

        const response = await taskService.updateTask(taskId, taskData);
        return res.status(200).json({
            msg: 'Updated the task',
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Something went wrong',
            err: error
        });
    }
}

const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const response = await taskService.deleteTask(taskId);
        return res.status(200).json({
            msg: 'Deleted the task',
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Something went wrong',
            err: error
        });
    }
}

const assignTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { user, assignee } = req.body;

        const response = await taskService.assignTask(taskId, user, assignee);
        return res.status(200).json({
            msg: 'Assigned the task',
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Something went wrong',
            err: error
        });
    }
}

export {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    assignTask
}