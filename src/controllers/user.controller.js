import userClass from "../persistence/user.persistence.js"

async function createUser(req, res, next){
    const fields = req.body
    
    
    const call = await userClass.createUser(fields)
    console.log(call);
    if(call === true){
        res.status(200).send('User created')
    }else if(call === 0){
        res.status(200).send('Missing fields')
    }else if(call === 1){
        res.status(200).send('Email already in use')
    }else if(call === 2){
        res.status(200).send('Passwords doesn`t match')
    }else{
        res.status(200).send('Internal Server Error')
    }
}

async function createUserPassportGH(req, res, next){
    
}

async function login(req, res, next){
    
}

async function loginPassportGH(req, res, next){
    
}

async function changePassword(req, res, next){
    
}

async function updateUser(req, res, next){
    
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
    changeRole
}