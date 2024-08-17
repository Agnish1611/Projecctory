import z from 'zod';
import jwt, { decode } from 'jsonwebtoken';

const userSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    pfp: z.string().optional(),
    profileSetup: z.boolean().optional()
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

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization ;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
            err: 'Unauthorized'
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({
                err: 'Forbidden'
            });
            req.user = decoded.UserInfo.id;
            next();
        }
    );
}

export {
    validateCreateRequest,
    validateUpdateRequest,
    validateFriendRequest,
    verifyJWT
}