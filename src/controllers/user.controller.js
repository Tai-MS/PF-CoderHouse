import usersService from '../services/users.service.js';
import service from '../services/users.service.js'
import transport from '../utils/mailer.js'


async function createUser(req, res, next){
    const fields = req.body
    /*
        Type of Responses:
            0: missing fields
            1: email in use
            2: passwords doesn`t match
            other: other
            true: accomplished
    */
    console.log(fields);
    const call = await service.createUser(fields)
    if(call === true){
        res.status(200).redirect('/')
    }else if(call === 0){
        res.status(200).send('Missing fields')
    }else if(call === 1){
        res.status(200).send('Email already in use')
    }else if(call === 2){
        res.status(200).send('Passwords doesn`t match')
    }else{
        res.status(404).send('Unexpected error')
    }
}

async function createUserPassportGH(req, res, next){
    
}

async function login(req, res, next) {
    const fields = req.body;
    const call = await service.login(fields);
    res.cookie('auth-token', res.locals.token, { httpOnly: true });
    if (call === true) {
        req.user = { email: fields.email, id: call.id }; 
        res.redirect('/products')
    } else if (call === 0) {
        res.status(200).send('Incorrect credentials');
    } else if (call === 1) {
        res.status(200).send('User don`t found');
    } else {
        res.status(404).send('Unexpected error');
    }
}

async function loginPassportGH(req, res, next){
    
}

async function reqChangePassword(req, res, next){
    const fields = req.body.email
    return await usersService.reqChangePass(fields)
}

async function changePassword(req, res, next){
    const fields = req.body
    const call = service.changePassword(fields)
    res.send(call)
}

async function updateUser(req, res, next){
    const fields = req.body
    const call = await service.updateUser(fields);
    if(call === true){
        res.status(200).send('User updated')
    }else{
        res.status(404).send('Unexpected error')
    }
}

async function logout(req, res, next){
    
}

async function changeRole(req, res, next){
    
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
    reqChangePassword
}