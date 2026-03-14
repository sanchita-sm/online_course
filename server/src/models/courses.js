const { getConnection } = require('../config/db')

const findAll = async () => {
  const conn = await getConnection()
  const [rows] = await conn.query('SELECT * FROM courses')
  return rows
}

const findById = async (id) => {
  const conn = await getConnection()
  const [rows] = await conn.query('SELECT * FROM courses WHERE id = ?', [id])
  return rows[0]
}

const findCourseByCategoryID = async (category_id) => {
    const conn = await getConnection()
    const [rows] = await db.query('SELECT * FROM courses WHERE category_id = ?',[category_id])
    return rows[0]
}

const findCourseByName = async (keyword) => {
    const conn = await getConnection()
    const [rows] = await db.query('SELECT * FROM courses WHERE title LIKE ?',[`%${keyword}%`])
    return rows[0]
}

const create = async (data) => {
  const conn = await getConnection()
  const { firstname, lastname, age, gender, interests, description } = data
  const [result] = await conn.query(
    'INSERT INTO courses (title, description, age, gender, interests, description) VALUES (?, ?, ?, ?, ?, ?)',
    [firstname, lastname, age, gender, interests, description]
  )
  return result
}

const update = async (id, data) => {
  const conn = await getConnection()
  const { firstname, lastname, age, gender, interests, description } = data
  const [result] = await conn.query(
    'UPDATE users SET firstname=?, lastname=?, age=?, gender=?, interests=?, description=? WHERE id=?',
    [firstname, lastname, age, gender, interests, description, id]
  )
  return result
}

const remove = async (id) => {
  const conn = await getConnection()
  const [result] = await conn.query('DELETE FROM users WHERE id = ?', [parseInt(id)])
  return result
}

module.exports = { findAll, findById, findCourseByCategoryID, findCourseByName, create, update, remove }