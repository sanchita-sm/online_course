const express = require('express')
const router = express.Router()
const controller = require('../controllers/progress')

router.post('/lesson/:lesson_id', controller.markLessonComplete)
router.get('/lesson/:lesson_id', controller.getLessonProgress)
router.get('/course/:course_id', controller.getCourseProgress)

module.exports = router