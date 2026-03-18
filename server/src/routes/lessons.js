const express = require('express');
const router = express.Router();
const controller = require('../controllers/lessons');
const authenticateJWT = require('../middlewares/authenticateJWT');
const authorizeRole = require('../middlewares/authorizeRole');

router.get('/course/:id', controller.getByCourse);
router.get('/:id', controller.getById);

// สร้าง/แก้ไข/ลบ บทเรียน (เฉพาะครู/อาจารย์)
router.post('/', authenticateJWT, authorizeRole(['ครู/อาจารย์']), controller.create);
router.put('/:id', authenticateJWT, authorizeRole(['ครู/อาจารย์']), controller.update);
router.delete('/:id', authenticateJWT, authorizeRole(['ครู/อาจารย์']), controller.remove);

module.exports = router;