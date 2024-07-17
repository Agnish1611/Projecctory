import mongoose from 'mongoose';

const recurringSchema = new mongoose.Schema({
    isReurring: {
        type: Boolean,
        default: false
    },
    recurringType: {
        type: String,
        enum: { 
            values: ['Daily', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 
            message: '{VALUE} is not supported' 
        }
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    }
}, {_id: false});

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true,
        maxLength: [280, 'Too many characters']
    },
    completed: {
        type: String,
        default: false
    },
    priority: {
        type: Number,
        default: 0,
        min: [0, 'invalid priority'],
        max: [3, 'invalid priority']
    },
    labels: [
        {
            type: String
        }
    ],
    date: {
        type: String
    },
    recurring: recurringSchema,
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {timestamps: true});

const Task = mongoose.model('Task', taskSchema);
export default Task;