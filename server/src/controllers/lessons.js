const LessonModel = require('../models/lessons')

const create = async (req, res, next) => {
  try {
    const { course_id, title, description, video_url, position } = req.body
    const errors = []
    if (!course_id) errors.push('กรุณาระบุ course_id')
    if (!title) errors.push('กรุณากรอกชื่อ lessons')
    if (!video_url) errors.push('กรุณาระบุ video_url')
    if (!position) errors.push('กรุณาระบุ position')
    if (errors.length > 0)
      return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบ', errors })
    const result = await LessonModel.create(req.body)
    res.json({ message: 'create success', data: result })
  } catch (error) {
    next(error)
  }
}

const getByCourse = async (req, res, next) => {
  try {
    const course_id = req.params.id
    const lessons = await LessonModel.findByCourseID(course_id)
    res.json(lessons)
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const lesson = await LessonModel.findByID(req.params.id)
    if (!lesson) return res.status(404).json({ message: 'ไม่พบ lesson' })
    res.json(lesson)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const result = await LessonModel.update(req.params.id, req.body)
    res.json({ message: 'update success', data: result })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const result = await LessonModel.remove(req.params.id)
    res.json({ message: 'delete success', data: result })
  } catch (error) {
    next(error)
  }
}

module.exports = { getByCourse, getById, create, update, remove }