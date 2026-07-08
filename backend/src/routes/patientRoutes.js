const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// Rotas fixas ANTES de "/:id" para nao conflitar com o parametro dinamico
router.get('/unclaimed', patientController.listUnclaimed);
router.get('/', patientController.list);
router.get('/:id', patientController.getOne);
router.put('/:id', patientController.update);
router.post('/:id/claim', patientController.claimPatient);

module.exports = router;