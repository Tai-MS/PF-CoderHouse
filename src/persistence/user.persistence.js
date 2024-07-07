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

            const userId = new mongoose.Types.ObjectId();

            const cart = await cartClass.createCart(userId);

            if (!cart) {
                throw new Error('Error creating cart');
            }

            fields = {
                ...fields,
                _id: userId, 
                cart: userId 
            }

            const c = await userModel.create(fields);
            return c;
            
        } catch (error) {
            return error;
        }
    }

    async getAll(){
        try {
            const users = await userModel.find()
            return users
        } catch (error) {
            return error
        }
    }

    async createSession(sessionData) {
        try {
            console.log('create Session');
            const session = await sessionModel.create(sessionData);
            return session;
        } catch (error) {
            return error;
        }
    }

    async getUser(emailOrObject) {
        try {
            const email = typeof emailOrObject === 'object' ? emailOrObject.email : emailOrObject;
            console.log(typeof emailOrObject);
            console.log(emailOrObject);
            console.log(email);

            // Primero intenta buscar por email
            const user = await userModel.findOne({ email: email });
            if (user) {
                return user;
            }

            // Luego intenta buscar por ID, pero solo si el valor es un ObjectId válido
            if (mongoose.Types.ObjectId.isValid(email)) {
                const userById = await userModel.findOne({ _id: email });
                if (userById) {
                    return userById;
                }
            }

            // Si no se encuentra nada, retorna null
            return null;
        } catch (error) {
            return error;
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
            const response = await userModel.updateOne({email: fields.email}, fields, { new: true });
            console.log(response);
            return response;
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
