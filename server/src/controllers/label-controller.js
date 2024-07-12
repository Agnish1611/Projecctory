import LabelService from "../services/label-service.js";

const labelService = new LabelService();

async function getAllLabels(req, res) {
    try {
        const labels = await labelService.getLabelsByUser(req.params.id);
        return res.status(201).json({
            data: labels,
            success: true,
            message: 'Successfully fetched the labels',
            error: {}
        });
    } catch (error) {
        console.log('controller error',error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to fetch the labels',
            error: error
        });
    }
}

export {
    getAllLabels
}