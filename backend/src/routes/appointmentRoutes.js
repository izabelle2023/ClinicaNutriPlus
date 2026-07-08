const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);
router.post('/', appointmentController.create);
router.get('/', appointmentController.list);
router.patch('/:id/status', appointmentController.updateStatus);
router.delete('/:id', appointmentController.remove);

module.exports = router;
