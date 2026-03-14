const TagModel = require('../models/tags')

const getAll = async (req, res, next) => {
  try {
    const tags = await TagModel.findAll()
    res.json(tags)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const { name } = req.body
    if (!name) return res.status(400).json({ message: 'กรุณากรอกชื่อ tag', errors: ['กรุณากรอกชื่อ tag'] })
    const result = await TagModel.create(name)
    res.json({ message: 'insert ok', data: result })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, create }
