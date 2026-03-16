const QuizzesModel = require('../models/quizzes')
const QuizchoicesModel = require('../models/quiz_choices')
const QuizattemptsModel = require('../models/quiz_attempts')

const create = async (req, res, next) => {
    try {
        const { lesson_id, question, choices } = req.body
        const quiz = await QuizzesModel.create({
            lesson_id, question
        })
        const quiz_id = quiz.insertId
        for (let c of choices) {
            await QuizchoicesModel.create({
                quiz_id, choice_text: c.text, is_correct: c.is_correct
            })
        }
        res.json({
            message: "Quiz created"
        })
    } catch (error) {
        next(error)
    }
}

const getQuizByLesson = async (req, res, next) => {
    try {
        const lesson_id = req.params.id
        const quiz = await QuizzesModel.findByLesson(lesson_id)
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" })
        }
        const choices = await QuizchoicesModel.findByQuiz(quiz.id)
        res.json({
            quiz, choices
        })
    } catch (error) {
        next(error)
    }
}

const submit = async (req, res, next) => {
    try {
        const { quiz_id, student_id, choice_id } = req.body
        const result = await QuizattemptsModel.create({
            quiz_id, student_id, choice_id
        })
        res.json({
            message: "Submit success",
            data: result
        })
    } catch (error) {
        next(error)
    }
}


const getQuizAttempts = async (req, res, next) => {
    try {
        const student_id = req.params.id
        const attempts = await QuizattemptsModel.findByStudent(student_id)
        res.json(attempts)
    } catch (error) {
        next(error)
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await QuizzesModel.remove(req.params.id)
        res.json({ message: 'delete success', data: result })
    } catch (error) {
        next(error)
    }
}

module.exports = { create, getQuizByLesson, submit, getQuizAttempts, remove }