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
  const [rows] = await conn.query('SELECT * FROM courses WHERE category_id = ?', [category_id])
  return rows
}

const findCourseByName = async (keyword) => {
  const conn = await getConnection()
  const [rows] = await conn.query('SELECT * FROM courses WHERE title LIKE ?', [`%${keyword}%`])
  return rows
}

const create = async (data) => {
  const conn = await getConnection()
  const { title, description, category_id, level_id, teacher_id } = data
  const [result] = await conn.query(
    'INSERT INTO courses (title, description, category_id, level_id, teacher_id) VALUES (?, ?, ?, ?, ?)',
    [title, description, category_id, level_id, teacher_id]
  )
  return result
}

const update = async (id, data) => {
  const conn = await getConnection()
  const { title, description, category_id, level_id } = data
  const [result] = await conn.query(
    'UPDATE courses SET title=?, description=?, category_id=?, level_id=? WHERE id=?',
    [title, description, category_id, level_id, id]
  )
  return result
}

const remove = async (id) => {
  const conn = await getConnection()
  const [result] = await conn.query('DELETE FROM courses WHERE id = ?', [parseInt(id)])
  return result
}

module.exports = { findAll, findById, findCourseByCategoryID, findCourseByName, create, update, remove }