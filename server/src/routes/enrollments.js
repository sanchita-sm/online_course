const express = require('express')
const router = express.Router()
const controller = require('../controllers/enrollments')
const authenticateSession = require('../middlewares/authenticateSession')
const authorizeRole = require('../middlewares/authorizeRole')

router.post('/', authenticateSession, authorizeRole(['student']), controller.enrollCourse)
router.get('/course/:course_id/students', authenticateSession, authorizeRole(['teacher']), controller.getStudentsByCourseID)
router.get('/student/:student_id/courses', authenticateSession, controller.getCoursesByStudentID)

module.exports = router