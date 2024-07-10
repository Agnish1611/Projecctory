import TaskService from "../services/task-service.js";

const taskService = new TaskService();

const createTask = async (req, res) => {
    try {
        const data = parseUserData(req);

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
        const tasks = await taskService.getAllByUser(req.body.user);
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
        const data = parseUserData(req);
        const id = req.params.id;
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

function parseUserData(req) {
    let data = {
        user: req.body.user,
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

export {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask
}