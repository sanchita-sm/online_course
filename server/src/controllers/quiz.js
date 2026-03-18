const QuizzesModel = require('../models/quizzes')
const QuizchoicesModel = require('../models/quiz_choices')
const QuizattemptsModel = require('../models/quiz_attempts')

const create = async (req, res, next) => {
    try {
        const { lesson_id, question, choices } = req.body
        if (!choices || choices.length === 0) {
            return res.status(400).json({ message: 'Choices required' })
        }
        const hasCorrect = choices.some(c => c.is_correct)
        if (!hasCorrect) {
            return res.status(400).json({ message: 'At least one correct answer required' })
        }
        const quiz = await QuizzesModel.create({
            lesson_id, question
        })
        const quiz_id = quiz.insertId
        for (let c of choices) {
            await QuizchoicesModel.create({
                quiz_id,
                choice_text: c.text,
                is_correct: c.is_correct
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
        const lesson_id = req.params.lesson_id
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
        const { quiz_id, student_id, selected_choice_id } = req.body
        const choice = await QuizchoicesModel.findById(selected_choice_id)
        if (!choice || choice.quiz_id !== quiz_id) {
            return res.status(400).json({ message: 'Invalid choice' })
        }
        const score = choice.is_correct ? 1 : 0
        await QuizattemptsModel.create({
            quiz_id,
            student_id,
            selected_choice_id,
            score
        })
        res.json({
            message: "Submit success",
            score
        })
    } catch (error) {
        next(error)
    }
}

const getQuizAttempts = async (req, res, next) => {
    try {
        const quiz_id = req.params.quiz_id
        const attempts = await QuizattemptsModel.getQuizAttempts(quiz_id)
        res.json(attempts)
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const quiz_id = req.params.id
        const { question, choices } = req.body
        await QuizzesModel.update(quiz_id, { question })
        if (choices && choices.length > 0) {
            for (let c of choices) {
                if (c.id) {
                    await QuizchoicesModel.update(c.id, { 
                        choice_text: c.text,
                        is_correct: c.is_correct
                    })
                } else {
                    await QuizchoicesModel.create({
                        quiz_id,
                        choice_text: c.text,
                        is_correct: c.is_correct
                    })
                }
            }
        }
        res.json({ message: 'Quiz updated' })
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

module.exports = { create, getQuizByLesson, submit, getQuizAttempts, update, remove }