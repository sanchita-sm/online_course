const { getConnection } = require('../config/db')

const enrollCourse = async (student_id, course_id) => {
    const conn = await getConnection()
    const [result] = await conn.query('INSERT INTO enrollments (student_id, course_id) VALUES (?,?)',
    [student_id, course_id])
  return result
}

const findStudentsByCourseID = async (course_id) => {
    const conn = await getConnection()
    const [rows] = await conn.query(`SELECT users.*
        FROM enrollments
        JOIN users
        ON enrollments.student_id = users.id
        WHERE enrollments.course_id = ?`,[course_id])
    return rows
}

const findCoursesByStudentID = async (student_id) => {
    const conn = await getConnection()
    const [rows] = await conn.query(`SELECT courses.*
        FROM enrollments
        JOIN courses
        ON enrollments.course_id = courses.id
        WHERE enrollments.student_id = ?`,[student_id])
    return rows
}

const checkEnrollment = async (student_id, course_id) => {
    const conn = await getConnection()
    const [rows] = await conn.query(
        'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?',
        [student_id, course_id]
    )
    return rows[0]
}

module.exports = { enrollCourse, findStudentsByCourseID, findCoursesByStudentID, checkEnrollment }