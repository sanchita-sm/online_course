const app = require('./src/app')
const { getConnection } = require('./src/config/db')

const port = process.env.PORT || 8000

app.listen(port, async () => {
  await getConnection()
  console.log('http server run at ' + port)
})
