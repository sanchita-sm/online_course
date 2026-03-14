const express = require('express')
const router = express.Router()
const controller = require('../controllers/tasks')

router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.post('/', controller.create)
router.put('/:id', controller.update)
router.delete('/:id', controller.remove)
router.post('/:id/tags', controller.addTag)
router.delete('/:id/tags/:tagId', controller.removeTag)

module.exports = router
