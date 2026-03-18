const { getConnection } = require('../config/db');

const LevelModel = {
  findAll: async () => {
    const conn = await getConnection();
    const [rows] = await conn.query('SELECT * FROM levels ORDER BY id ASC');
    return rows;
  },

  findById: async (id) => {
    const conn = await getConnection();
    const [rows] = await conn.query('SELECT * FROM levels WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = LevelModel;