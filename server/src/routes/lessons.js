const express = require('express')
const router = express.Router()
const controller = require('../controllers/lessons')
const authorizeRole = require('../middleware/authorizeRole')

router.get('/', controller.getByCourse)
router.get('/:id', controller.getById)
router.post('/', authorizeRole('ครู/อาจารย์'), controller.create)
router.put('/:id', authorizeRole('ครู/อาจารย์'), controller.update)
router.delete('/:id', authorizeRole('ครู/อาจารย์'), controller.remove)

module.exports = router