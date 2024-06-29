//External imports
import express from 'express'
import cookieParser from 'cookie-parser'
import hbs from 'hbs'

//Internal imports
import { __dirname, constants } from './utils/utils.js'
import { connections, connectDB } from './utils/database.js'

const app = express()
//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser('myParser'))

//Routes imports
import usersRouter from './routes/user.router.js'
import productsRouter from './routes/products.route.js'
import cartsRouter from './routes/carts.route.js'
import sessionsRouter from './routes/session.route.js'
import userSessionRouter from './routes/user.session.route.js'
import viewsRouter from './routes/views.route.js'
//Routes
app.use('/user', usersRouter)
app.use('/products', productsRouter)
app.use('/carts', cartsRouter)
app.use('/sessions', sessionsRouter)
app.use('/userSession', userSessionRouter)
app.use('/', viewsRouter)

//HBS Configuration
hbs.registerPartials(__dirname, '/views', function (err) {})
app.set('View engine', 'hbs')
app.set('views', __dirname + '/public')

app.use(express.static(__dirname + '/public'))

//Server init
connections()
app.listen(constants.PORT, () => {
    console.log(`Server running at port ${constants.PORT}`);
})
connectDB()