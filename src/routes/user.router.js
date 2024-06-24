import express from 'express'
import userController from '../controllers/user.controller.js'


const router = express.Router()

router.post('/signup', async(req, res, next) => {
    // console.log(req);
    userController.createUser(req, res, next)
})






export default router