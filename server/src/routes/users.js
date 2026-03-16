const express = require('express')
const router = express.Router()
const controller = require('../controllers/users')

router.post('/register', controller.validateUser, controller.register)
router.post('/login', controller.login)
router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.put('/:id', controller.update)
router.delete('/:id', controller.remove)

module.exports = router