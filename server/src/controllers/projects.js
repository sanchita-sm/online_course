const ProjectModel = require('../models/projects')

const getAll = async (req, res, next) => {
  try {
    const projects = await ProjectModel.findAll()
    res.json(projects)
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const project = await ProjectModel.findById(req.params.id)
    if (!project) return res.status(404).json({ message: 'ไม่พบ project' })
    const tasks = await ProjectModel.findTasksByProjectId(req.params.id)
    res.json({ ...project, tasks })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const { name, user_id } = req.body
    const errors = []
    if (!name) errors.push('กรุณากรอกชื่อ project')
    if (!user_id) errors.push('กรุณาระบุ user_id')
    if (errors.length > 0) return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบ', errors })

    const result = await ProjectModel.create(req.body)
    res.json({ message: 'insert ok', data: result })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const result = await ProjectModel.update(req.params.id, req.body)
    res.json({ message: 'update ok', data: result })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const result = await ProjectModel.remove(req.params.id)
    res.json({ message: 'delete ok', data: result })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getById, create, update, remove }
