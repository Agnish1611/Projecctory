import z from 'zod';

const projectSchema = z.object({
    name: z.string(),
    admins: z.array(z.string()),
    participants: z.array(z.string())
});

const updateSchema = z.object({
    addParticipant: z.string(),
    removeParticipant: z.string(),
    removeTask: z.string(),
    addAdmin: z.string(),
    removeAdmin: z.string()
});

const taskSchema = z.object({
    user: z.string().optional(),
    description: z.string().max(300, 'Description can be of maximum 300 characters'),
    completed: z.boolean().optional(),
    labels: z.array(z.string()).optional(),
    priority: z.enum(['normal', 'important', 'urgent']).optional(),
    deadline: z.string(),
    assignee: z.string().optional()
});

const validateCreateRequest = async (req, res, next) => {
    try {
        await projectSchema.parseAsync(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            msg: 'Project details are invalid',
            err: error
        });
    }
}

const validateUpdateRequest = async (req, res, next) => {
    try {
        const partialUpdate = updateSchema.partial();
        await partialUpdate.parseAsync(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            msg: 'Request body has invalid values',
            err: error
        });
    }
}

const validateAddTaskRequest = async (req, res, next) => {
    try {
        await taskSchema.parseAsync(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            msg: 'Invalid task details',
            err: error
        });
    }
}

export {
    validateCreateRequest,
    validateUpdateRequest,
    validateAddTaskRequest
}