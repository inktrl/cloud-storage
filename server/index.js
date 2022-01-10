require('dotenv').config()

const express      = require('express')
const cookieParser = require('cookie-parser')
const mongoose     = require('mongoose')
const fileUpload   = require('express-fileupload')
const path         = require('path')

const PORT = process.env.PORT || 5000
const app = express()

const corsMiddleware     = require('cors')
const filePathMiddleware = require('./middleware/filepath.middleware')
const errorMiddleware    = require('./middleware/error.middleware')

app.use(fileUpload({}))

app.use(corsMiddleware({
  credentials: true,
  origin: process.env.CLIENT_URL
}))                                       
app.use(filePathMiddleware(path.resolve(__dirname, 'files')))

app.use(cookieParser())
app.use(express.json())
app.use(express.static('static'))

app.use('',           require('./routes/redirect.routes'))
app.use('/api',       require('./routes/user.routes'))
app.use('/api/files', require('./routes/file.routes'))

app.use(errorMiddleware)

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
  } catch (error) {
    console.log('Server Error', error.message)
  }
}

start()