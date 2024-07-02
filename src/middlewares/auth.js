// auth.js
import jwt from 'jsonwebtoken'
import { constants } from '../utils.js'

const tokenBlacklist = new Set();
export const verifyTokenSocket = (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        const err = new Error('Authentication error');
        err.data = { content: 'Token not provided' }; 
        return next(err);
    }

    jwt.verify(token, constants.SECRET_KEY, (err, decoded) => {
        if (err) {
            const error = new Error('Authentication error');
            error.data = { content: 'Invalid token' }; 
            return next(error);
        }

        socket.user = decoded; 
        next();
    });
};
export function generateToken(req, res, next) {
    const { email, id } = req.body; 
    const token = jwt.sign({
        email: email,
        id: id
    }, constants.SECRET_KEY,
    { expiresIn: '30m' });
    res.locals.token = token; 
    res.header('auth-token', token);
    console.log(token);
    next();
}

export function verifyToken(req, res, next) {
    //Use this variable if the login is made trough the API, not the frontend
    // const token = req.header('auth-token');
    const token = req.cookies['auth-token'];
    const paramToken = req.params.token
    if (!token || !paramToken) return res.status(401).send('Access Denied');

    if (tokenBlacklist.has(token) ||tokenBlacklist.has(paramToken)) {
        return res.status(403).send('Token has been revoked');
    }
    try {
        let verified
        if(token){
            verified = jwt.verify(token, constants.SECRET_KEY);

        }else if(paramToken){
            verified = jwt.verify(paramToken, constants.SECRET_KEY);

        }
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}

export function revokeToken(req, res, next) {
    const token = req.cookies['auth-token'];
    if (!token) return res.status(400).send('Token is required');
    tokenBlacklist.add(token);
    res.status(200).render('login'); 
}
