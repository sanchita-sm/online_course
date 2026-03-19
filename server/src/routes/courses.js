const express = require('express')
const router = express.Router()
const controller = require('../controllers/courses')
const authenticateSession = require('../middlewares/authenticateSession')
const authorizeRole = require('../middlewares/authorizeRole')

router.get('/', controller.getAll)
router.get('/search', controller.search)
router.get('/:id', controller.getById)

router.post('/', authenticateSession, authorizeRole(['teacher']), controller.create)
router.put('/:id', authenticateSession, authorizeRole(['teacher']), controller.update)
router.delete('/:id', authenticateSession, authorizeRole(['teacher']), controller.remove)

module.exports = router