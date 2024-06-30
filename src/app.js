//External imports
import express from 'express';
import cookieParser from 'cookie-parser';
import hbs from 'hbs';
import { createServer } from 'http'; 
import { Server } from 'socket.io';

//Internal imports
import { __dirname, constants, rootDir } from './utils.js';
import { connections, connectDB } from './utils/database.js';
import productsController from './controllers/products.controller.js';
import cartsController from './controllers/carts.controller.js';
// import { verifyTokenSocket } from './middlewares/auth.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('myParser'));

//Routes imports
import usersRouter from './routes/user.router.js';
import productsRouter from './routes/products.route.js';
import cartsRouter from './routes/carts.route.js';
import sessionsRouter from './routes/session.route.js';
import userSessionRouter from './routes/user.session.route.js';
import viewsRouter from './routes/views.route.js';
import { verifyToken } from './middlewares/auth.js';

//Routes
app.use('/user', usersRouter);
app.use('/api', productsRouter);
app.use('/carts', cartsRouter);
app.use('/sessions', sessionsRouter);
app.use('/userSession', userSessionRouter);
app.use('/', viewsRouter);

// HBS Configuration
hbs.registerPartials(__dirname + '/views');
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

// Handle socket.io connections
// io.use(verifyTokenSocket); 

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('message', (message) => {
        console.log('Message from client:', message);
    });

    socket.on('getProducts', async (query) => {
        try {
            const products = await productsController.getAll();
            socket.emit('productsResponse', { 
                result: 'success', 
                payload: products,
                options: query 
            });
        } catch (error) {
            socket.emit('productsResponse', { result: 'error' });
        }
    });

    socket.on('addProductsToCart', async(fields) => {
        const { cId, pId } = fields;
        const response = await cartsController.addProductToCart(fields);
        socket.emit('productsResponse', response);
    });

    socket.on('getCartByIdResponse', async (email) => {
        try {
            const response = await cartsController.getCart(email);
            console.log("getCart", response);
            socket.emit('cartResponse', response);
        } catch (error) {
            console.error('Error getting cart:', error);
            socket.emit('cartResponse', { result: 'error', message: error.message });
        }
    });
});


//Server init
connections();
server.listen(constants.PORT, () => { 
    console.log(`Server running at port ${constants.PORT}`);
});
connectDB();