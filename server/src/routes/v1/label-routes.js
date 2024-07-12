import express from 'express';

import * as labelController from '../../controllers/label-controller.js';

const router = express.Router();

// /api/v1/label/:id GET
router.get('/:id',
    labelController.getAllLabels);

export default router;