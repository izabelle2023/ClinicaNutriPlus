const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlanController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);
router.post('/', mealPlanController.create);
router.get('/patient/:patientId', mealPlanController.listByPatient);
router.put('/:id', mealPlanController.update);
router.delete('/:id', mealPlanController.remove);

module.exports = router;
