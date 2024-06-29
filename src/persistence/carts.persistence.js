import cartModel from '../models/cart.model.js'
import productClass from '../persistence/products.persistence.js'

class CartClass {
    async createCart(userId) {
        try {
            return await cartModel.create({_id: userId, total: 0, cartProducts: []});
        } catch (error) {
            console.error("Error creating cart:", error);
            return error;
        }
    }

    async getCart(cId) {
        try {
            const cart = await cartModel.findById(cId);
            if (cart) {
                return cart;
            }
            return 0;
        } catch (error) {
            return error;
        }
    }

    async sumTotal(fields) {
        try {
            const {cId, pId} = fields;
            const cart = await this.getCart(cId);
            const product = await productClass.getOne(pId);
            if (cart && product) {
                let total = cart.total + product.price;
                await cartModel.updateOne({_id: cId}, {total: total});
                return total;
            }
            return 0;
        } catch (error) {
            return error;
        }
    }

    async lessTotal(fields) {
        try {
            const {cId, pId} = fields;
            const cart = await this.getCart(cId);
            const product = await productClass.getOne(pId);
            if (cart && product) {
                let total = cart.total - product.price;
                await cartModel.updateOne({_id: cId}, {total: total});
                return total;
            }
            return 0;
        } catch (error) {
            return error;
        }
    }

    async addProductToCart(fields) {
        try {
            const {cId, pId, quantity = 1} = fields;
            const cart = await this.getCart(cId);
            const product = await productClass.getOne(pId);

            if (cart && product) {
                for (let i = 0; i < quantity; i++) {
                    await this.sumTotal({cId, pId});
                }
                return await cartModel.updateOne(
                    {_id: cId},
                    {$push: {cartProducts: {quantity: quantity, productId: pId}}}
                );
            }
            return false;
        } catch (error) {
            return error;
        }
    }

    async deleteProduct(fields) {
        try {
            const {cId, pId} = fields;
            const cart = await this.getCart(cId);

            if (cart) {
                const updatedProducts = cart.cartProducts.filter(product => product.productId !== pId);
                await cartModel.updateOne(
                    { _id: cId },
                    { $set: { cartProducts: updatedProducts } }
                );
                await this.lessTotal({cId, pId});
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error deleting product from cart:", error);
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