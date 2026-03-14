const { getConnection } = require('../config/db')

const submitAnswer = async (data) => {
    const conn = await getConnection()
    const { lesson_id, question } = data
    const [result] = await conn.query(
        'INSERT INTO quizzes (quiz_id, student_id, student_answer) VALUES (?, ?, ?)',
        [quiz_id, student_id, student_answer]
    )
    return result
}

const getStudentAttempts = async (student_id) => {
    const conn = await getConnection()
    const [rows] = await conn.query(
        `SELECT attempts.id,
        questions.question_text,
        answers.answer_text,
        attempts.created_at
        FROM attempts
        JOIN questions
        ON attempts.question_id = questions.id
        JOIN answers
        ON attempts.answer_id = answers.id
        WHERE attempts.student_id = ?`,[student_id]
    )
    return rows
}

module.exports = { submitAnswer, getStudentAttempts }