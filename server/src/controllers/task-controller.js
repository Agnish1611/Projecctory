import TaskService from "../services/task-service.js";

const taskService = new TaskService();

    async function createTask(req, res) {
        try {
            const data = parseUserData(req, true);
    
            const task = await taskService.create(data);
            return res.status(201).json({
                data: task,
                success: true,
                message: 'Successfully created a task',
                error: {}
            });
        } catch (error) {
            console.log('controller error',error);
            return res.status(500).json({
                data: {},
                success: false,
                message: 'Failed to create the task',
                error: error
            });
        }
    }

    async function getTasks(req, res) {
        try {
            const id = req.params.id;

            const filter = filterBuilder(req.query);

            const tasks = await taskService.getTasksByUser(id, filter);

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

    async function completeTask (req, res) {
        try {
            const id = req.params.id;
            const value = req.query.value;
            const task = await taskService.update(id, {completed: value});
            return res.status(200).json({
                data: task,
                success: true,
                message: 'Successfully completed the task',
                error: {}
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                data: {},
                success: false,
                message: 'Failed to complete the task',
                error: error
            });
        }
    }
    
    async function updateTask(req, res) {
        try {
            const data = parseUserData(req, false);
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
    
    async function deleteTask(req, res) {
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
    
    function parseUserData(req, hasUser) {
        let data = {};
        if (hasUser) data = { ...data, user: req.params.id};
        if (req.body.description) data = { ...data, description: req.body.description};
    
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

    function filterBuilder(query) {
        let filter = {};
        if (query.date) {
            filter = { date: query.date };
        }
        if (query.completed) {
            filter = { ...filter, completed: true };
        }
        else if (query.not_completed) {
            filter = { ...filter, completed: false };
        }
        if (query.label) {
            filter = { ...filter, label: query.label };
        }
        if (query.priority) {
            filter = { ...filter, priority: query.priority };
        }

        return filter;
    }


export {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    completeTask
};