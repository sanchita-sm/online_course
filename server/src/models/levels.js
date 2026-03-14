const { getConnection } = require('../config/db')

const findAll = async () => {
  const conn = await getConnection()
  const [rows] = await conn.query('SELECT * FROM levels')
  return rows
}

const create = async (data) => {
  const conn = await getConnection()
  const { level } = data
  const [result] = await conn.query(
    'INSERT INTO levels (level) VALUES (?)',
    [level]
  )
  return result
}

module.exports = { findAll, create }