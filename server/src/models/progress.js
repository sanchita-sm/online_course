const { getConnection } = require('../config/db')

const markLessonComplete = async (student_id, lesson_id) => {
    const conn = await getConnection()
    const [result] = await conn.query(
        `INSERT INTO progress (student_id, lesson_id, completed)
        VALUES (?, ?, ?)`,[student_id, lesson_id, completde]
    )
    return result
}

const getStudentProgress = async (student_id, course_id) => {
    const conn = await getConnection()
    const [rows] = await conn.query(`SELECT lessons.id, lessons.title, progress.completed
        FROM lessons
        LEFT JOIN progress
        ON lessons.id = progress.lesson_id
        AND progress.student_id = ?
        WHERE lessons.course_id = ?`,[student_id, course_id]
    )
    return rows
}

module.exports = { markLessonComplete, getStudentProgress }