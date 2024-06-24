import userModel from '../models/user.model.js'
import {createHash} from '../utils/utils.js'
import bcrypt from 'bcrypt'
class UserClass{

    async createUser(fields){
        /*
            Type of Errors:
                0: missing fields
                1: email in use
                2: passwords doesn`t match
                3: other
                true: accomplished
        */
        const {firstName, lastName, email, age, password, confirmPass } = fields
        console.log(fields);
        if(!firstName || !lastName || !email || !age || !password ||!confirmPass){
            return 0
        }
        const fullName = firstName + " " + lastName
        const existingUser = await userModel.find({email: email})
        if(existingUser.length !== 0){
            console.log("f");
            return 1
        }

        if(password !== confirmPass){
            return 2
        }

        const hashedPass = await bcrypt.hash(password, 10)
        console.log(hashedPass);
        await userModel.create({
            fullName: fullName,
            email: email,
            age: age,
            password: hashedPass,
            role: 2,
            documents: [],
            lastConnection: 'None'
        })
        
        return true
    }

}

const userClass = new UserClass()

export default userClass