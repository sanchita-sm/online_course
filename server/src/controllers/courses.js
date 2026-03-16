const CourseModel = require('../models/courses')

const getAll = async (req, res, next) => {
    try {
        const courses = await CourseModel.findAll()
        res.json(courses)
    } catch (error) {
        next(error)
    }
}

const getById = async (req, res, next) => {
    try {
        const course = await CourseModel.findById(req.params.id)
        if (!course) return res.status(404).json({ message: 'ไม่พบ course' })
        res.json(course)
    } catch (error) {
        next(error)
    }
}

const search = async (req, res, next) => {
    try {
        const { keyword } = req.query
        const result = await CourseModel.findCourseByName(keyword)
        res.json(result)
    } catch (error) {
        next(error)
    }
}

const create = async (req, res, next) => {
    try {
        const { title, description, category_id, level_id, teacher_id } = req.body
        const errors = []
        if (!title) errors.push('กรุณากรอกชื่อ course')
        if (!category_id) errors.push('กรุณาระบุ category_id')
        if (!level_id) errors.push('กรุณาระบุ level_id')
        if (!teacher_id) errors.push('กรุณาระบุ teacher_id')
        if (errors.length > 0)
        return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบ', errors })
        const result = await CourseModel.create(req.body)
        res.json({ message: 'create success', data: result })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const result = await CourseModel.update(req.params.id, req.body)
        res.json({ message: 'update success', data: result })
    } catch (error) {
        next(error)
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await CourseModel.remove(req.params.id)
        res.json({ message: 'delete success', data: result })
    } catch (error) {
        next(error)
    }
}

module.exports = { getAll, getById, search, create, update, remove }