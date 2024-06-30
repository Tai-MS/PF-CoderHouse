
import express from 'express'
import { generateToken, verifyToken, revokeToken } from '../middlewares/auth.js'
import cartClass from '../persistence/carts.persistence.js'

const router = express.Router()

router.get('/products', verifyToken, async(req, res, next) => {
    const token = req.user.email
    const user = await cartClass.getCart(token);
    console.log('user views', user);
    res.render('products',  {token});
});

router.get('/', generateToken, async(req, res, next) => {
    res.render('login');
});

router.get('/signup', async(req, res, next) => {
    res.render('signup');
});

router.get('/cart', verifyToken, async(req, res, next) => {
    const token = req.user.email
    const user = await cartClass.getCart(token);
    res.render('cart', { user: JSON.stringify(user) });
});

export default router;
