const { getConnection } = require('../config/db')

const findByQuiz = async (quiz_id) => {
  const conn = await getConnection()
  const [rows] = await conn.query('SELECT * FROM quiz_choices WHERE quiz_id = ?', [quiz_id])
  return rows
}

const create = async (data) => {
  const conn = await getConnection()
  const { quiz_id, choice_text, is_correct } = data
  const [result] = await conn.query(
    'INSERT INTO quiz_choices (quiz_id, choice_text, is_correct) VALUES (?, ?, ?)',
    [quiz_id, choice_text, is_correct]
  )
  return result
}

const update = async (id, data) => {
  const conn = await getConnection()
  const { quiz_id, choice_text, is_correct } = data
  const [result] = await conn.query(
    'UPDATE quiz_choices SET quiz_id=?, choice_text=?, is_correct=? WHERE id=?',
    [quiz_id, choice_text, is_correct, id]
  )
  return result
}

const remove = async (id) => {
  const conn = await getConnection()
  const [result] = await conn.query('DELETE FROM quiz_choices WHERE id = ?', [parseInt(id)])
  return result
}

module.exports = { findByQuiz, create, update, remove }