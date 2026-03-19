const { getConnection } = require('../config/db')

const submitAnswer = async (data) => {
  const conn = await getConnection()
  const { quiz_id, student_id, selected_choice_id } = data

  const [choiceRows] = await conn.query(
    'SELECT is_correct FROM quiz_choices WHERE id = ? AND quiz_id = ?',
    [selected_choice_id, quiz_id]
  )
  if (choiceRows.length === 0) {
    throw new Error('Invalid choice for this quiz')
  }

  const [result] = await conn.query(
    'INSERT INTO quiz_attempts (quiz_id, student_id, selected_choice_id) VALUES (?, ?, ?)',
    [quiz_id, student_id, selected_choice_id]
  )

  return { ...result, is_correct: choiceRows[0].is_correct }
}

const getQuizAttempts = async (quiz_id) => {
  const conn = await getConnection()
  const [rows] = await conn.query(
    `SELECT
      quiz_attempts.id,
      quiz_attempts.student_id,
      users.firstname,
      users.lastname,
      quiz_choices.choice_text,
      quiz_choices.is_correct,
      quiz_attempts.submitted_at
    FROM quiz_attempts
    JOIN users ON quiz_attempts.student_id = users.id
    JOIN quiz_choices ON quiz_attempts.selected_choice_id = quiz_choices.id
    WHERE quiz_attempts.quiz_id = ?`,
    [quiz_id]
  )
  return rows
}

const getStudentScore = async (student_id, lesson_id) => {
  const conn = await getConnection()
  const [rows] = await conn.query(
    `SELECT
      COUNT(*) AS total,
      SUM(qc.is_correct) AS correct
    FROM quiz_attempts qa
    JOIN quiz_choices qc ON qa.selected_choice_id = qc.id
    JOIN quizzes q ON qa.quiz_id = q.id
    WHERE qa.student_id = ? AND q.lesson_id = ?`,
    [student_id, lesson_id]
  )
  return rows[0]
}

module.exports = { submitAnswer, getQuizAttempts, getStudentScore }