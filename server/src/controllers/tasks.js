const TaskModel = require('../models/tasks')

const getAll = async (req, res, next) => {
  try {
    const tasks = await TaskModel.findAll()
    res.json(tasks)
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const task = await TaskModel.findById(req.params.id)
    if (!task) return res.status(404).json({ message: 'ไม่พบ task' })
    const tags = await TaskModel.findTagsByTaskId(req.params.id)
    res.json({ ...task, tags })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const { title, project_id } = req.body
    const errors = []
    if (!title) errors.push('กรุณากรอกชื่อ task')
    if (!project_id) errors.push('กรุณาระบุ project_id')
    if (errors.length > 0) return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบ', errors })

    const result = await TaskModel.create(req.body)
    res.json({ message: 'insert ok', data: result })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const result = await TaskModel.update(req.params.id, req.body)
    res.json({ message: 'update ok', data: result })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const result = await TaskModel.remove(req.params.id)
    res.json({ message: 'delete ok', data: result })
  } catch (error) {
    next(error)
  }
}

const addTag = async (req, res, next) => {
  try {
    const { tag_id } = req.body
    if (!tag_id) return res.status(400).json({ message: 'กรุณาระบุ tag_id', errors: ['กรุณาระบุ tag_id'] })
    await TaskModel.addTag(req.params.id, tag_id)
    res.json({ message: 'add tag ok' })
  } catch (error) {
    next(error)
  }
}

const removeTag = async (req, res, next) => {
  try {
    await TaskModel.removeTag(req.params.id, req.params.tagId)
    res.json({ message: 'remove tag ok' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getById, create, update, remove, addTag, removeTag }
