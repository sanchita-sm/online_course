const UserModel = require('../models/users')

const validateUser = (req, res, next) => {
  const { firstname, lastname, email, password, role } = req.body
  const errors = []

  if (!firstname) errors.push('กรุณากรอกชื่อ')
  if (!lastname) errors.push('กรุณากรอกนามสกุล')
  if (!email) errors.push('กรุณากรอกอีเมล')
  if (!password) errors.push('กรุณากรอกรหัสผ่าน')
  if (!role) errors.push('กรุณากรอกสถานะ')
  if (role && !['ครู/อาจารย์','นักเรียน/นักศึกษา'].includes(role)) {
    errors.push('role ต้องเป็น ครู/อาจารย์ หรือ นักเรียน/นักศึกษา')
  }

  if (errors.length > 0) return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบหรือไม่ถูกต้อง', errors })

  next()
}

const register = async (req, res, next) => {
  try {
    const existing = await UserModel.findByEmail(req.body.email)
    if (existing) return res.status(400).json({ message: 'Email ซ้ำ', errors: ['Email นี้มีคนใช้งานแล้ว'] })

    const result = await UserModel.create(req.body)
    res.status(201).json({ message: 'Register success', data: result })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.findByEmail(email)
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Email หรือ password ไม่ถูกต้อง' })
    }
    res.json({ message: 'Login success', data: user })
  } catch (error) {
    next(error)
  }
}

const getAll = async (req, res, next) => {
  try {
    const users = await UserModel.findAll()
    res.json(users)
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const user = await UserModel.findByID(req.params.id)
    if (!user) return res.status(404).json({ message: 'ไม่พบผู้ใช้' })
    res.json(user)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const result = await UserModel.update(req.params.id, req.body)
    res.json({ message: 'Update success', data: result })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const result = await UserModel.remove(req.params.id)
    res.json({ message: 'Delete success', data: result })
  } catch (error) {
    next(error)
  }
}

module.exports = { validateUser, register, login, getAll, getById, update, remove }