const UserModel = require('../models/users')

const validateUser = (data) => {
    const errors = []
    if (!data.firstname) errors.push('กรุณากรอกชื่อ')
    if (!data.lastname) errors.push('กรุณากรอกนามสกุล')
    if (!data.email) errors.push('กรุณากรอกอีเมล')
    if (!data.password) errors.push('กรุณากรอกรหัสผ่าน')
    if (!data.role) errors.push('กรุณาเลือกสถานะ')
    return errors
}

const register = async (req, res, next) => {
    try {
        const errors = validateUser(req.body)
        if (errors.length > 0) return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบ', errors })
        const result = await UserModel.create(req.body)
        res.json({ message: 'Register success', data: result })
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findUserByEmail(email)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid password"
            })
        }
        res.json({
            message: "Login success", user
        })
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
        const user = await UserModel.findById(req.params.id)
        if (!user) return res.status(404).json({ message: 'Not Found' })
        res.json(user)
    } catch (error) {
        next(error)
    }
}

module.exports = { validateUser, register, login, getAll, getById }