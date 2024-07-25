import mongoose from 'mongoose';

const recurringSchema = new mongoose.Schema({
    type: {
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
        ref: 'User'
    },
    description: {
        type: String,
        required: true,
        maxLength: [300, 'Too many characters']
    },
    completed: {
        type: String,
        default: false
    },
    priority: {
        type: String,
        default: 'normal',
        enum: {
            values: ['normal', 'important', 'urgent'],
            message: '{VALUE} is not supported'
        }
    },
    labels: [
        {
            type: String
        }
    ],
    date: {
        type: String,
    },
    deadline: {
        type: String,
    },
    time: {
        type: String,
    },
    recurring: recurringSchema,
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {timestamps: true});

const Task = mongoose.model('Task', taskSchema);
export default Task;