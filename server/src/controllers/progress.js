const ProgressModel = require('../models/progress')

const markLessonComplete = async (req, res, next) => {
  try {
    const { student_id, lesson_id } = req.body
    const result = await ProgressModel.markLessonComplete(student_id, lesson_id)
    res.json({ message: 'Lesson completed', data: result })
  } catch (error) {
    next(error)
  }
}

const getLessonProgress = async (req, res, next) => {
  try {
    const { student_id, course_id } = req.params
    const progress = await ProgressModel.getLessonProgress(student_id, course_id)
    res.json(progress)
  } catch (error) {
    next(error)
  }
}

const getCourseProgress = async (req, res, next) => {
  try {
    const { student_id, course_id } = req.params
    const progress = await ProgressModel.getCourseProgress(student_id, course_id)
    res.json(progress)
  } catch (error) {
    next(error)
  }
}

module.exports = { markLessonComplete, getLessonProgress, getCourseProgress }