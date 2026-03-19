const express = require('express')
const router = express.Router()
const controller = require('../controllers/progress')

router.post('/complete', controller.markLessonComplete)
router.get('/student/:student_id/course/:course_id/lessons', controller.getLessonProgress)
router.get('/student/:student_id/course/:course_id', controller.getCourseProgress)

module.exports = router