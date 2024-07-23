import z from 'zod';

const taskSchema = z.object({
    user: z.string().optional(),
    description: z.string().max(300, 'Description can be of maximum 300 characters'),
    completed: z.boolean().optional(),
    labels: z.array(z.string()).optional(),
    priority: z.enum(['normal', 'important', 'urgent']).optional(),
    date: z.string().regex(/^\d{2}\-\d{2}\-\d{4}$/),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    recurring: z.object({
        type: z.enum(['Daily', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
        startDate: z.string().regex(/^\d{2}\-\d{2}\-\d{4}$/),
        endDate: z.string().regex(/^\d{2}\-\d{2}\-\d{4}$/)
    }).optional(),
    assignee: z.string().optional()
});

async function validateCreateRequest(req, res, next) {
    try {
        await taskSchema.parseAsync(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            msg: 'Task details are invalid',
            err: error
        });
    }
}

async function validateUpdateRequest(req, res, next) {
    try {
        const partialTask = taskSchema.partial();
        await partialTask.parseAsync(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            msg: 'Task details are invalid',
            err: error
        });
    }
}

async function validateGetRequest(req, res, next) {
    try {
        const querySchema = z.object({
            user: z.string().optional(),
            label: z.string().optional(),
            priority: z.enum(['normal', 'important', 'urgent']).optional(),
            completed: z.enum(['true', 'false']).optional(),
            date: z.string().regex(/^\d{2}\-\d{2}\-\d{4}$/).optional()
        });
        await querySchema.parseAsync(req.query);
        next();
    } catch (error) {
        return res.status(400).json({
            msg: 'Search queries are invalid',
            err: error
        });
    }
}

export {
    validateCreateRequest,
    validateUpdateRequest,
    validateGetRequest
}