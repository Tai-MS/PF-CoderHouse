import mongoose from "mongoose";

const cartCollection = 'carts'

const cartShcema = new mongoose.Schema({
    cartProducts: [{
        quantity: {type: Number, default: 0},
        producID: {type: mongoose.Schema.Types.ObjectId, ref: 'products'}
    }],
    total: {type: Number, default: 0}
})

const cartModel = mongoose.model(cartShcema, cartCollection)

export default cartModel