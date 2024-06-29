import userClass from "../persistence/user.persistence.js";
import bcrypt from 'bcrypt'

async function createUser(fields){
    
    const {firstName, lastName, email, age, password, confirmPass } = fields

    if(!firstName || !lastName || !email || !age || !password ||!confirmPass){
        return 0
    }
    const fullName = firstName + " " + lastName

    if(password !== confirmPass){
        return 2
    }
        
    const hashedPass = await bcrypt.hash(password, 10);

    const userData = {
        fullName: fullName,
        email: email,
        age: age,
        password: hashedPass,
        role: 'user',
        documents: [],
        lastConnection: 'None'
    }

    return await userClass.createUser(userData)
}

async function createUserPassportGH(){
    
}

async function login(fields){
    const {email, password} = fields
    const date = new Date()
    if(!email || !password){
        return 0
    }
    fields.date = date
    return userClass.login(fields)
}

async function loginPassportGH(){
    
}

async function changePassword(){
    
}

async function updateUser(fields) {
    const user = await userClass.getUser(fields.email);

    if (!user) {
        return 1; 
    }

    const [firstName, lastName] = user.fullName.split(' ');

    let newFields = { ...fields };

    if (firstName !== fields.firstName && lastName !== fields.lastName) {
        newFields = {
            ...fields,
            fullName: fields.firstName + " " + fields.lastName
        };
    } else if (firstName !== fields.firstName) {
        newFields.fullName = fields.firstName + " " + lastName;
    } else if (lastName !== fields.lastName) {
        newFields.fullName = firstName + " " + fields.lastName;
    }
    delete newFields.firstName;
    delete newFields.lastName;
    delete newFields.password

    return await userClass.updateUser(newFields);
}


async function logout(){
    
}

async function changeRole(){
    
}

export default{
    createUser,
    createUserPassportGH,
    login,
    loginPassportGH,
    changePassword,
    updateUser,
    logout,
    changeRole
}