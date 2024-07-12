import Label from '../models/label-model.js'

class LabelRepo {
    async bulkCreate(data) {
        try {
            const labels = await Label.insertMany(data);
            return labels;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async findLabels(filter){
        try {
            const labels = await Label.find(filter);
            return labels;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async findLabelById(id){
        try {
            const labels = await Label.findById(id).populate('tasks');
            return labels;
        } catch (error) {
            throw error;
        }
    }

    async findByName(data) {
        try {
            const labels = await Label.find({title: data});
            return labels;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async destroy(id) {
        try {
            const response = await Label.findByIdAndDelete(id);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default LabelRepo;