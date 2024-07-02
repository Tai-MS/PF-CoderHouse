import userClass from "../persistence/user.persistence.js";
import bcrypt from 'bcrypt'
import { generateToken } from "../middlewares/auth.js";
import transport from '../utils/mailer.js'
import { constants } from "../utils.js";

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

async function reqChangePass(fields){
    const user = userClass.getUser(fields)
    if(!user){
        return 0
    }

    const token = generateToken({ email: fields.email });
    await transport.sendEmail({
        from: constants.USERMAILER,
        to: fields,
        subject: 'Request for password reset.',
        html: `
          <div>
              <h1>Solicitud for password reset.</h1>
              <p>We've received a notification that you want to change your password. If it was you, follow the next link: ${fields}.</p>
              <p>E-Commerce CoderHouse Password Reset</p>
              <a href="http://localhost:8080/changepass/${token}" style="text-decoration: none;">
                  <button style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                      Change Password
                  </button>
              </a>
          </div>
      `

    })
}

async function changePassword(fields){
    const {email, newPass, confirmNewPass} = fields
    const user = await userClass.getUser(email)
    if(!email || !newPass || !confirmNewPass || !user){
        return 0
    }

    const comparedWithOldPass = await bcrypt.compare(newPass, user.password)
    if(comparedWithOldPass){
        return 1
    }
    
    if(newPass != confirmNewPass){
        return 2
    }
    const hashedNewPass = bcrypt.hash(newPass)
    fields = {
        ...fields,
        user: user,
        newPass: hashedNewPass
    }

    return await userClass.changePassword(fields)
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
    changeRole,
    reqChangePass
}