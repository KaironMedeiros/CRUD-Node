require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.emit('pronto')
  })
  .catch(e => console.log(e));

const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const helmet = require('helmet')
const csrf = require('csurf')

const routes = require('./routes')
const path = require('path')
const { checkCsrfError, csrfMiddleware } = require('./src/middlewares/middlewares')


app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.json())
app.use(helmet())



const sessionOptions = session({
  secret: 'texto q ninguem vai saber',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  },
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING })
})
app.use(sessionOptions)
app.use(flash())

app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

app.use(csrf())

app.use(csrfMiddleware)
app.use(checkCsrfError)
app.use(routes)


app.listen(3000, () => {
  console.log('executando na porta 3000')
})

