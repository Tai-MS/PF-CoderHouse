import userModel from '../models/user.model.js'
import bcrypt from 'bcrypt'
import cartClass from './carts.persistence.js'
import mongoose from 'mongoose'

class UserClass {
    async createUser(fields) {
        try {
            const {fullName, email, age, password} = fields
            
            const existingUser = await userModel.find({email: email})
            if (existingUser.length !== 0) {
                return 1
            }

            // Generar un _id manualmente
            const userId = new mongoose.Types.ObjectId();

            // Crear el carrito con el mismo _id
            const cart = await cartClass.createCart(userId);

            // Asegurar que el carrito se haya creado correctamente
            if (!cart) {
                throw new Error('Error creating cart');
            }

            // Crear el usuario con el mismo _id
            fields = {
                ...fields,
                _id: userId, // Asignar el mismo _id
                cart: userId // Asumimos que el campo `cart` guarda el _id del carrito
            }

            await userModel.create(fields);
            return true;
            
        } catch (error) {
            return error;
        }
    }

    async getUser(email) {
        try {
            const user = await userModel.findOne({email: email})
            if (user) {
                return user
            }
            const userById = await userModel.findOne({_id: email})
            if(userById){
                return userById
            }
            return 0
        } catch (error) {
            return error
        }
    }

    async login(fields) {
        try {
            const {email, password} = fields
            const existingUser = await this.getUser(email)
            
            if (!existingUser) {
                return 1
            }

            const comparedPass = await bcrypt.compare(password, existingUser.password)
            await userModel.updateOne({email: email}, {lastConnection: fields.date})
            if (!comparedPass) {
                return 0
            }
            return true
        } catch (error) {
            return error
        }
    }

    async updateUser(fields) {
        try {
            await userModel.updateOne({email: fields.email}, fields, { new: true });
            return true;
        } catch (error) {
            return error;
        }
    }

    async changePassword(fields){
        try {
            const {user, newPass} = fields

            return await userModel.updateOne({_id: user._id}, {password: newPass})
        } catch (error) {
            return error
        }
    }
}

const userClass = new UserClass();

export default userClass;
