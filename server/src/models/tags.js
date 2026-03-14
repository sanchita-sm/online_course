const { getConnection } = require('../config/db')

const findAll = async () => {
  const conn = await getConnection()
  const [rows] = await conn.query('SELECT * FROM tags ORDER BY name')
  return rows
}

const create = async (name) => {
  const conn = await getConnection()
  const [result] = await conn.query('INSERT INTO tags (name) VALUES (?)', [name])
  return result
}

module.exports = { findAll, create }
