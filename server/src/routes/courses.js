const express = require('express');
const router = express.Router();
const controller = require('../controllers/courses');
const authenticateJWT = require('../middlewares/authenticateJWT');
const authorizeRole = require('../middlewares/authorizeRole');

router.get('/', controller.getAll);
router.post('/search', controller.search);
router.get('/:id', controller.getById);

// POST/PUT/DELETE ต้อง login และเป็น ครู/อาจารย์ เท่านั้น
router.post('/', authenticateJWT, authorizeRole(['ครู/อาจารย์']), controller.create);
router.put('/:id', authenticateJWT, authorizeRole(['ครู/อาจารย์']), controller.update);
router.delete('/:id', authenticateJWT, authorizeRole(['ครู/อาจารย์']), controller.remove);

module.exports = router;