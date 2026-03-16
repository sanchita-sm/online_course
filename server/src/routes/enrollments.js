const express = require('express')
const router = express.Router()
const controller = require('../controllers/enrollments')

router.post('/', controller.enrollCourse)

router.get('/course/:course_id/students', controller.getStudentsByCourseID)
router.get('/student/:student_id/courses', controller.getCoursesByStudentID)

module.exports = router