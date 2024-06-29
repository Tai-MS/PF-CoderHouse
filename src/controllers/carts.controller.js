import service from '../services/carts.service.js'

async function createCart(req, res, next){
    const call = service.createCart()
}

async function deleteCart(req, res, next){
    const fields = req.body
    const call = service.deleteCart(fields)    
}

async function addProductToCart(req, res, next){
    const fields = req.body
    const call = service.addProductToCart(fields)    
}

async function deleteProductFromCart(req, res, next){
    const fields = req.body
    const call = service.deleteProductFromCart(fields)    
}

async function getAll(req, res, next){
    const call = service.getAll()
}

async function getOneCart(req, res, next){
    const fields = req.body
    const call = service.getOneCart(fields)
}

async function clearCart(req, res, next){
    const fields = req.body
    const call = service.clearCart(fields)    
}

export default{
    createCart,
    deleteCart,
    addProductToCart,
    deleteProductFromCart,
    getAll,
    getOneCart
}