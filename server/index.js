require('dotenv').config()
const app = require('./src/app')
const { getConnection } = require('./src/config/db')

const port = process.env.PORT || 8000
const startServer = async () => {
  try {
    await getConnection()
    console.log('Database connected')
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Database connection failed:', error)
  }
}
startServer()