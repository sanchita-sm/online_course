const { getConnection } = require('../config/db');

const CategoryModel = {
  findAll: async () => {
    const conn = await getConnection();
    const [rows] = await conn.query('SELECT * FROM categories ORDER BY id ASC');
    return rows;
  },

  findById: async (id) => {
    const conn = await getConnection();
    const [rows] = await conn.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = CategoryModel;