import cartModel from '../models/cart.model.js'
import productClass from '../persistence/products.persistence.js'
import userClass from '../persistence/user.persistence.js'
import userModel from '../models/user.model.js'
class CartClass {
    async createCart(userId) {
        try {
            return await cartModel.create({_id: userId, total: 0, cartProducts: []});
        } catch (error) {
            return error;
        }
    }

    async getCart(cId) {
        try {
            const user = await userClass.getUser(cId)
            if(user){
                const cart = await cartModel.findById(user._id);
                if (cart) {
                    return cart;
                }
            }
            console.log('user',user);
            const cart = await cartModel.findById(cId);
                     if (cart) {
                return cart;
            }
            console.log('cart', cart);
            return 0;
        } catch (error) {
            return error;
        }
    }

    async sumTotal(fields) {
        try {
            const {cartId, pId} = fields;
            const cart = await this.getCart(cartId);
            const product = await productClass.getOne(pId);
                 if (cart && product) {
                let total = cart.total + product.price;
                await cartModel.updateOne({_id: cartId}, {total: total});
                return total;
            }
            return 0;
        } catch (error) {
            return error;
        }
    }

    async lessTotal(fields) {
        try {
            const {user, pId} = fields;
            const cart = await this.getCart(user);
            const product = await productClass.getOne(pId);
            if (cart && product) {
                let total = cart.total - product.price;
                await cartModel.updateOne({_id: cart._id}, {total: total});
                return total;
            }
            return 0;
        } catch (error) {
            return error;
        }
    }

    async addProductToCart(fields) {
        try {
            const { user, pId, quantity = 1 } = fields;
            const userM = await userClass.getUser(user);
            const cart = await this.getCart(userM._id);
            const product = await productClass.getOne(pId);
            console.log('product per',product);
            console.log('cart per', fields);
            if (cart && product) {
                const cartId = cart._id;
                for (let i = 0; i < quantity; i++) {
                    await this.sumTotal({ cartId, pId });
                }
    
                const existingProductIndex = cart.cartProducts.findIndex(prod => {
                    return prod.productId.toString()=== pId
                });
    
                if (existingProductIndex !== -1) {
                    const newQuantity = cart.cartProducts[existingProductIndex].quantity + quantity;
                    cart.cartProducts[existingProductIndex].quantity = newQuantity;
    
                    return await cartModel.updateOne(
                        { _id: cartId },
                        { $set: { cartProducts: cart.cartProducts } }
                    );
                } else {
                    return await cartModel.updateOne(
                        { _id: cartId },
                        { $push: { cartProducts: { quantity: quantity, productId: pId } } }
                    );
                }
            }
            return false;
        } catch (error) {
            return error;
        }
    }
    
    
    

    async deleteProduct(fields) {
        try {
            const {user, pId} = fields;
            const cart = await this.getCart(user);
            if (cart) {
                const updatedProducts = cart.cartProducts.filter(product => product.productId !== pId);
                if(updatedProducts[0].quantity > 1){
                    let newQuantity = updatedProducts[0].quantity - 1
                    await cartModel.updateOne(
                        { _id: cart._id },
                        { $set: { cartProducts: {quantity: newQuantity} } }
                    );
                }else{
                    await cartModel.updateOne(
                        { _id: cart._id },
                        { $set: { cartProducts: [] } }
                    );
                }
                await this.lessTotal({user, pId});
                return true;
            }
            return false;
        } catch (error) {
            return error;
        }
    }

    async cleanCart(cId) {
        try {
            const cart = await this.getCart(cId);
            if (cart) {
                return await cartModel.updateOne(
                    { _id: cId },
                    { $set: { total: 0, cartProducts: [] } }
                );
            }
            return 0;
        } catch (error) {
            return error;
        }
    }
}

const cartClass = new CartClass();

export default cartClass;