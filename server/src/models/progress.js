const { getConnection } = require('../config/db')

const markLessonComplete = async (student_id, lesson_id) => {
    const conn = await getConnection()
    const [result] = await conn.query(
        `INSERT INTO progress (student_id, lesson_id, completed)
         VALUES (?, ?, ?)`,
        [student_id, lesson_id, 1]
    )
    return result
}

const getLessonProgress = async (student_id, course_id) => {
    const conn = await getConnection()
    const [rows] = await conn.query(
        `SELECT lessons.id, lessons.title, progress.completed
        FROM lessons
        LEFT JOIN progress
        ON lessons.id = progress.lesson_id
        AND progress.student_id = ?
        WHERE lessons.course_id = ?`, [student_id, course_id]
    )
    return rows
}

const getCourseProgress = async (student_id, course_id) => {
    const conn = await getConnection()
    const [rows] = await conn.query(
        `SELECT 
        COUNT(lessons.id) AS total_lessons,
        SUM(CASE WHEN progress.completed = 1 THEN 1 ELSE 0 END) AS completed_lessons
        FROM lessons
        LEFT JOIN progress
        ON lessons.id = progress.lesson_id
        AND progress.student_id = ?
        WHERE lessons.course_id = ?`, [student_id, course_id]
    )
    return rows[0]
}

module.exports = { markLessonComplete, getLessonProgress, getCourseProgress }