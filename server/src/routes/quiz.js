const express = require('express')
const router = express.Router()
const controller = require('../controllers/quiz')

router.post('/', controller.create)
router.get('/lesson/:lesson_id', controller.getQuizByLesson)
router.post('/submit', controller.submit)
router.get('/attempts/:quiz_id', controller.getQuizAttempts)
router.put('/:id', controller.update)
router.delete('/:id', controller.remove)

module.exports = router