import z from 'zod';

const userSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().email()
});

async function validateCreateRequest(req, res, next) {
    try {
        await userSchema.parseAsync(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            msg: 'User details are invalid',
            err: error
        });
    }
}

async function validateUpdateRequest(req, res, next) {
    try {
        const partialUser = userSchema.partial();
        await partialUser.parseAsync(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            msg: 'User details are invalid',
            err: error
        });
    }
}

async function validateFriendRequest(req, res, next) {
    try {
        const schema = z.object({
            id: z.string()
        });
        await schema.parseAsync(req.body);
        next();
    } catch(error) {
        return res.status(400).json({
            msg: 'User id is invalid in request body',
            err: error
        });
    }
}

export {
    validateCreateRequest,
    validateUpdateRequest,
    validateFriendRequest
}