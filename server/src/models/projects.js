const { getConnection } = require('../config/db')

const findAll = async () => {
  const conn = await getConnection()
  const [rows] = await conn.query(`
    SELECT projects.*, users.firstname, users.lastname
    FROM projects
    JOIN users ON projects.user_id = users.id
    ORDER BY projects.created_at DESC
  `)
  return rows
}

const findById = async (id) => {
  const conn = await getConnection()
  const [rows] = await conn.query(`
    SELECT projects.*, users.firstname, users.lastname
    FROM projects
    JOIN users ON projects.user_id = users.id
    WHERE projects.id = ?
  `, [id])
  return rows[0]
}

const findTasksByProjectId = async (id) => {
  const conn = await getConnection()
  const [rows] = await conn.query(`
    SELECT tasks.*, users.firstname AS assigned_firstname, users.lastname AS assigned_lastname
    FROM tasks
    LEFT JOIN users ON tasks.assigned_user_id = users.id
    WHERE tasks.project_id = ?
    ORDER BY tasks.created_at DESC
  `, [id])
  return rows
}

const create = async (data) => {
  const conn = await getConnection()
  const { name, description, user_id } = data
  const [result] = await conn.query(
    'INSERT INTO projects (name, description, user_id) VALUES (?, ?, ?)',
    [name, description || '', user_id]
  )
  return result
}

const update = async (id, data) => {
  const conn = await getConnection()
  const { name, description } = data
  const [result] = await conn.query(
    'UPDATE projects SET name=?, description=? WHERE id=?',
    [name, description, id]
  )
  return result
}

const remove = async (id) => {
  const conn = await getConnection()
  const [result] = await conn.query('DELETE FROM projects WHERE id = ?', [parseInt(id)])
  return result
}

module.exports = { findAll, findById, findTasksByProjectId, create, update, remove }
