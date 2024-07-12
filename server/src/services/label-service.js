import LabelRepo from "../repositories/label-repo.js";

class LabelService {
    constructor() {
        this.labelRepo = new LabelRepo();
    }

    async getLabelsByUser(id) {
        try {
            const labels = await this.labelRepo.findLabels({users: { $in: [id] }});
            return labels;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }


}

export default LabelService;