const { getConnection } = require('../config/db')

const submitAnswer = async (data) => {
    const conn = await getConnection()
    const { quiz_id, student_id, selected_choice_id } = data

  // 1. เช็คว่า choice ถูกไหม
    const [choiceRows] = await conn.query(
        'SELECT is_correct FROM quiz_choices WHERE id = ? AND quiz_id = ?',
        [selected_choice_id, quiz_id]
    )
    if (choiceRows.length === 0) {
        throw new Error('Invalid choice for this quiz')
    }

    const isCorrect = choiceRows[0].is_correct
    const score = isCorrect ? 1 : 0

  // 2. insert attempt
    const [result] = await conn.query(
        `INSERT INTO quiz_attempts 
        (quiz_id, student_id, selected_choice_id, score) VALUES (?, ?, ?, ?)`,
        [quiz_id, student_id, selected_choice_id, score]
    )
    return result
}

const getQuizAttempts = async (quiz_id) => {
    const conn = await getConnection()
    const [rows] = await conn.query(
        `SELECT quiz_attempts.id,
        quiz_attempts.student_id,
        users.firstname,
        users.lastname,
        quiz_choices.choice_text,
        quiz_attempts.score,
        quiz_attempts.submitted_at
        FROM quiz_attempts
        JOIN users 
        ON quiz_attempts.student_id = users.id
        JOIN quiz_choices 
        ON quiz_attempts.selected_choice_id = quiz_choices.id
        WHERE quiz_attempts.quiz_id = ?`,
        [quiz_id]
    )
    return rows
}

const getStudentScore = async (student_id, quiz_id) => {
    const conn = await getConnection()
    const [rows] = await conn.query(
        `SELECT COALESCE(SUM(score), 0) AS total_score
        FROM quiz_attempts
        WHERE student_id = ? AND quiz_id = ?`,
        [student_id, quiz_id]
    )
    return rows[0]
}

module.exports = { submitAnswer, getQuizAttempts, getStudentScore }