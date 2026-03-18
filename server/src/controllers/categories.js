const CategoryModel = require('../models/categories')

const getAll = async (req, res, next) => {
    try {
        const categories = await CategoryModel.findAll()
        res.json(categories)
    } catch (error) {
        next(error)
    }
}

const getById = async (req, res, next) => {
  try {
    const category = await CategoryModel.findById(req.params.id)
    if (!category) return res.status(404).json({ message: 'ไม่พบ category' })
    res.json(category)
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getById }