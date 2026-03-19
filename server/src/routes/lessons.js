const express = require('express')
const router = express.Router()
const controller = require('../controllers/lessons')
const authenticateSession = require('../middlewares/authenticateSession')
const authorizeRole = require('../middlewares/authorizeRole')

router.get('/course/:id', controller.getByCourse)
router.get('/:id', controller.getById)

router.post('/', authenticateSession, authorizeRole(['teacher']), controller.create)
router.put('/:id', authenticateSession, authorizeRole(['teacher']), controller.update)
router.delete('/:id', authenticateSession, authorizeRole(['teacher']), controller.remove)

module.exports = router