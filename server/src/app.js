const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const path = require('path')
const session = require('express-session')
const errorHandler = require('./middlewares/errorHandler')
const swaggerSpec = require('./swagger')

const app = express()

app.use(bodyparser.json())
app.use(cors({
  origin: true,
  credentials: true  // จำเป็นเพื่อให้ session cookie ส่งข้ามได้
}))

// session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000  // มีอายุ 7 วัน
  }
}))

app.use('/users', require('./routes/users'))
app.use('/courses', require('./routes/courses'))
app.use('/lessons', require('./routes/lessons'))
app.use('/quiz', require('./routes/quiz'))
app.use('/enrollments', require('./routes/enrollments'))
app.use('/progress', require('./routes/progress'))
app.use('/categories', require('./routes/categories'))
app.use('/levels', require('./routes/levels'))

app.get('/api-docs/spec', (req, res) => res.json(swaggerSpec))
app.get('/api-docs', (req, res) => res.sendFile(path.join(__dirname, 'swagger-ui.html')))

app.use(errorHandler)

module.exports = app