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
    const quiz = await QuizzesModel.create({ lesson_id, question })
    const quiz_id = quiz.insertId
    for (let c of choices) {
      await QuizchoicesModel.create({
        quiz_id,
        choice_text: c.choice_text,
        is_correct: c.is_correct
      })
    }
    res.json({ message: 'Quiz created' })
  } catch (error) {
    next(error)
  }
}

const getQuizByLesson = async (req, res, next) => {
  try {
    const lesson_id = req.params.lesson_id
    const quizzes = await QuizzesModel.findByLesson(lesson_id)
    if (quizzes.length === 0) {
      return res.status(404).json({ message: 'Quiz not found' })
    }
    const result = await Promise.all(
      quizzes.map(async (quiz) => {
        const choices = await QuizchoicesModel.findByQuiz(quiz.id)
        return { ...quiz, choices }
      })
    )
    res.json(result)
  } catch (error) {
    next(error)
  }
}

const submit = async (req, res, next) => {
  try {
    const { quiz_id, student_id, selected_choice_id } = req.body
    const result = await QuizattemptsModel.submitAnswer({
      quiz_id,
      student_id,
      selected_choice_id
    })
    res.json({ message: 'Submit success', is_correct: result.is_correct })
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
            choice_text: c.choice_text,
            is_correct: c.is_correct
          })
        } else {
          await QuizchoicesModel.create({
            quiz_id,
            choice_text: c.choice_text,
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