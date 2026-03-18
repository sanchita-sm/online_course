const LevelModel = require('../models/levels')

const getAll = async (req, res, next) => {
    try {
        const levels = await LevelModel.findAll()
        res.json(levels)
    } catch (error) {
        next(error)
    }
}

const getById = async (req, res, next) => {
    try {
        const level = await LevelModel.findById(req.params.id)
        if (!level) return res.status(404).json({ message: 'ไม่พบ level' })
            res.json(level)
        } catch (error) {
            next(error)
        }
}

module.exports = { getAll, getById }