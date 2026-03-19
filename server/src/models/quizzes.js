const { getConnection } = require('../config/db')

const findByLesson = async (lesson_id) => {
  const conn = await getConnection()
  const [rows] = await conn.query('SELECT * FROM quizzes WHERE lesson_id = ?', [lesson_id])
  return rows
}

const create = async (data) => {
  const conn = await getConnection()
  const { lesson_id, question } = data
  const [result] = await conn.query(
    'INSERT INTO quizzes (lesson_id, question) VALUES (?, ?)',
    [lesson_id, question]
  )
  return result
}

const update = async (id, data) => {
  const conn = await getConnection()
  const { lesson_id, question } = data
  const [result] = await conn.query(
    'UPDATE quizzes SET lesson_id=?, question=? WHERE id=?',
    [lesson_id, question, id]
  )
  return result
}

const remove = async (id) => {
  const conn = await getConnection()
  const [result] = await conn.query('DELETE FROM quizzes WHERE id = ?', [parseInt(id)])
  return result
}

module.exports = { findByLesson, create, update, remove }