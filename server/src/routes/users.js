const express = require('express')
const router = express.Router()
const controller = require('../controllers/users')
const authenticateSession = require('../middlewares/authenticateSession')

router.post('/register', controller.validateUser, controller.register)
router.post('/login', controller.login)
router.post('/logout', controller.logout)

router.get('/', authenticateSession, controller.getAll)
router.get('/:id', authenticateSession, controller.getById)
router.put('/:id', authenticateSession, controller.update)
router.delete('/:id', authenticateSession, controller.remove)

module.exports = router