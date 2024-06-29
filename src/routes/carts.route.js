import express from 'express'
import cartsController from '../controllers/carts.controller.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

router.get('/getCart',verifyToken, async(req, res, next) => {
    await cartsController.getOneCart(req)
})

router.get('/', async(req, res, next) => {

})





export default router