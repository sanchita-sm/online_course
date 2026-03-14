const { getConnection } = require('../config/db')

const findAll = async () => {
  const conn = await getConnection()
  const [rows] = await conn.query('SELECT * FROM lessons')
  return rows
}

const findByID = async (id) => {
    const conn = await getConnection()
    const [rows] = await conn.query('SELECT * FROM lessons WHERE id = ?', [id])
    return rows[0]
}

const create = async (data) => {
    const conn = await getConnection()
    const { course_id, title, description, video_url, position } = data
    const [result] = await conn.query(
        'INSERT INTO lessons (course_id, title, description, video_url, position) VALUES (?, ?, ?, ?, ?)',
        [course_id, title, description, video_url, position]
    )
    return result
}

const update = async (id, data) => {
  const conn = await getConnection()
  const { course_id, title, description, video_url, position, id } = data
  const [result] = await conn.query(
    'UPDATE lessons SET course_id=?, title=?, description=?, video_url=?, position=? WHERE id=?',
    [course_id, title, description, video_url, position, id]
  )
  return result
}

const remove = async (id) => {
  const conn = await getConnection()
  const [result] = await conn.query('DELETE FROM lessons WHERE id = ?', [parseInt(id)])
  return result
}

module.exports = { findAll, findByID, create, update, remove }