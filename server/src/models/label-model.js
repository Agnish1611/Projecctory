import mongoose from "mongoose";

const labelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        }
    ]
}, {timestamps: true});

const Label = mongoose.model('Label', labelSchema);
export default Label;