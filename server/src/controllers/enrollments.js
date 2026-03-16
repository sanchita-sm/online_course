const enrollmentsModel = require('../models/enrollments')

const enrollCourse = async (req, res, next) => {
    try {
        const { student_id, course_id } = req.body
        const exist = await enrollmentsModel.checkEnrollment(student_id, course_id)
        if (exist) {
            return res.status(400).json({
                message: "Student already enrolled"
            })
        }
        const result = await enrollmentsModel.enrollCourse(student_id, course_id)
        res.json({
            message: "Enroll success", data: result
        })
    } catch (error) {
        next(error)
    }
}

const getStudentsByCourseID = async (req, res, next) => {
    try {
        const course_id = req.params.course_id
        const students = await enrollmentsModel.findStudentsByCourseID(course_id)
        res.json(students)
    } catch (error) {
        next(error)
    }
}

const getCoursesByStudentID = async (req, res, next) => {
    try {
        const student_id = req.params.student_id
        const courses = await enrollmentsModel.findCoursesByStudentID(student_id)
        res.json(courses)
    } catch (error) {
        next(error)
    }
}

module.exports = { enrollCourse, getStudentsByCourseID, getCoursesByStudentID }