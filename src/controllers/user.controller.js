import usersService from '../services/users.service.js';
import service from '../services/users.service.js'
import transport from '../utils/mailer.js'
import passport from 'passport';
import { constants } from '../utils.js';
import jwt from 'jsonwebtoken'

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
    const call = await service.createUser(fields)
    console.log(call);
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

async function getAll(req, res, next){
    const verifyUser = req.user.email
    const users = await service.getAll(verifyUser)
    if(users.length > 0){
        return res.render('allUsers', { users });
    }
    return res.send('No users found.')
}
async function login(req, res, next) {
    const fields = req.body;
    res.cookie('auth-token', res.locals.token, { httpOnly: true });
    passport.authenticate('login', { failureRedirect: '/faillogin' })(req, res, async () => {
        await service.login(fields);
        res.cookie('role', req.user.role, { maxAge: 10000, signed: true });
        res.cookie('username', req.user.firstName, { maxAge: 100000 });
        return res.status(200).redirect('/products')
    });
}

async function loginPassportGH(req, res, next) {
    passport.authenticate('github', { failureRedirect: '/login' }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            const token = jwt.sign({
                email: user.email,
                id: user._id
            }, constants.SECRET_KEY, { expiresIn: '30m' });
            res.cookie('auth-token', token, { httpOnly: true });
            return res.redirect('/products');
        });
    })(req, res, next);
}


async function reqChangePassword(req, res, next) {
    const email = req.body.email;
    const user = await usersService.getUserByEmail(email);
    if (!user) {
        return res.status(404).send('User not found');
    }
    const url = req.protocol + '://' + req.get('host')
    // console.log(req.protocol + '://' + req.get('host') + req.originalUrl);
    // console.log(req.protocol);
    // console.log(req.get('host'));
    // console.log(req.originalUrl);
    const token = res.locals.token;
    console.log('pre send', token);
    await transport.sendMail({
        from: constants.USERMAILER,
        to: email,
        subject: 'Request for password reset',
        html: `
          <div>
              <h1>Solicitud for password reset.</h1>
              <p>We've received a notification that you want to change your password. If it was you, follow the next link:</p>
              <p>E-Commerce CoderHouse Password Reset</p>
              <a href="${url}/changepass/${token}" style="text-decoration: none;">
                  <button style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                      Change Password
                  </button>
              </a>
          </div>
      `
    });

    res.status(200).send('Password reset email sent');
}


async function changePassword(req, res, next){
    let fields = req.body
    fields = {
        ...fields,
        email: req.user
    }
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

async function upload(req, res, next){
    if(!req.file){
        return res.redirect('/upload')
    }
    await usersService.upload(req)
    return res.status(200).send('File uploaded')
}

async function logout(req, res, next){
    if (req.session && req.session.passport.user) {
        res.clearCookie('username');
        res.clearCookie('role');
        req.session.destroy((err) => {
            if (err) {
                res.status(500).send('Internal server error');
            } else {
                setTimeout(() => {
                    res.redirect('/');
                }, 500)
            }
        });
    } else {
        console.log('No user session found');
        res.redirect('/');
    }
}

async function changeRole(req, res, next){
    const fields = {
        email: req.user.email,
        otherUserEmail: req.body.otherUserEmail,
        role: req.body.role
    }
    console.log(fields);
    const call = await service.changeRole(fields)
    return res.send(call)
}

export default{
    createUser,
    getAll,
    login,
    loginPassportGH,
    changePassword,
    updateUser,
    logout,
    changeRole,
    reqChangePassword,
    upload
}