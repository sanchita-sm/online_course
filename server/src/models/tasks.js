const { getConnection } = require('../config/db')

const findAll = async () => {
  const conn = await getConnection()
  const [rows] = await conn.query(`
    SELECT tasks.*, projects.name AS project_name,
      users.firstname AS assigned_firstname, users.lastname AS assigned_lastname
    FROM tasks
    JOIN projects ON tasks.project_id = projects.id
    LEFT JOIN users ON tasks.assigned_user_id = users.id
    ORDER BY tasks.created_at DESC
  `)
  return rows
}

const findById = async (id) => {
  const conn = await getConnection()
  const [rows] = await conn.query(`
    SELECT tasks.*, projects.name AS project_name,
      users.firstname AS assigned_firstname, users.lastname AS assigned_lastname
    FROM tasks
    JOIN projects ON tasks.project_id = projects.id
    LEFT JOIN users ON tasks.assigned_user_id = users.id
    WHERE tasks.id = ?
  `, [id])
  return rows[0]
}

const findTagsByTaskId = async (id) => {
  const conn = await getConnection()
  const [rows] = await conn.query(`
    SELECT tags.id, tags.name
    FROM tags
    JOIN task_tags ON tags.id = task_tags.tag_id
    WHERE task_tags.task_id = ?
  `, [id])
  return rows
}

const create = async (data) => {
  const conn = await getConnection()
  const { title, description, status, project_id, assigned_user_id } = data
  const [result] = await conn.query(
    'INSERT INTO tasks (title, description, status, project_id, assigned_user_id) VALUES (?, ?, ?, ?, ?)',
    [title, description || '', status || 'todo', project_id, assigned_user_id || null]
  )
  return result
}

const update = async (id, data) => {
  const conn = await getConnection()
  const { title, description, status, assigned_user_id } = data
  const [result] = await conn.query(
    'UPDATE tasks SET title=?, description=?, status=?, assigned_user_id=? WHERE id=?',
    [title, description, status, assigned_user_id || null, id]
  )
  return result
}

const remove = async (id) => {
  const conn = await getConnection()
  const [result] = await conn.query('DELETE FROM tasks WHERE id = ?', [parseInt(id)])
  return result
}

const addTag = async (taskId, tagId) => {
  const conn = await getConnection()
  await conn.query('INSERT IGNORE INTO task_tags (task_id, tag_id) VALUES (?, ?)', [taskId, tagId])
}

const removeTag = async (taskId, tagId) => {
  const conn = await getConnection()
  await conn.query('DELETE FROM task_tags WHERE task_id = ? AND tag_id = ?', [taskId, tagId])
}

module.exports = { findAll, findById, findTagsByTaskId, create, update, remove, addTag, removeTag }
