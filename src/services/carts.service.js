import cartClass from "../persistence/carts.persistence.js"

async function createCart(){
    return await cartClass.createCart()
}

async function deleteCart(fields){
    return await cartClass.deleteCart(fields)    
}

async function addProductToCart(fields){
    return await cartClass.addProductToCart(fields)    
}

async function deleteProductFromCart(fields){
    return await cartClass.deleteProductFromCart(fields)    
}

async function getAll(){
    return await cartClass.getAll()
}

async function getOneCart(fields){
    return await cartClass.getOneCart(fields)
}

async function cleanCart(fields){
    return await cartClass.cleanCart(fields)
}

export default{
    createCart,
    deleteCart,
    addProductToCart,
    deleteProductFromCart,
    getAll,
    getOneCart, 
    cleanCart
}