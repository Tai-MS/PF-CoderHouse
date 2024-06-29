import express from 'express'
import userController from '../controllers/user.controller.js'
import { generateToken, verifyToken, revokeToken } from '../middlewares/auth.js'

const router = express.Router()

router.post('/signup', async(req, res, next) => {
    userController.createUser(req, res, next)
})

router.post('/login', userController.login, generateToken)

router.post('/logout', verifyToken, revokeToken);

router.put('/updateUser', verifyToken, userController.updateUser)

router.put('changePass', verifyToken, userController.changePassword)

export default router