const express = require('express');
const router = express.Router();
const evolutionController = require('../controllers/evolutionController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);
router.post('/', evolutionController.create);
router.get('/patient/:patientId', evolutionController.listByPatient);
router.delete('/:id', evolutionController.remove);

module.exports = router;
