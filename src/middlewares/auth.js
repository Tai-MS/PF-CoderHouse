import jwt from 'jsonwebtoken'
import { constants } from '../utils/utils.js'

const tokenBlacklist = new Set();

export function generateToken(req, res, next) {
    const { email, id } = req.body; 
    const token = jwt.sign({
        email: email,
        id: id
    }, constants.SECRET_KEY,
    { expiresIn: '30m' });
    res.header('auth-token', token);
    console.log(token);
    next();
}

export function verifyToken(req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    if (tokenBlacklist.has(token)) {
        return res.status(403).send('Token has been revoked');
    }
    
    try {
        const verified = jwt.verify(token, constants.SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}

export function revokeToken(req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(400).send('Token is required');
    console.log('loggedout');
    tokenBlacklist.add(token);
    console.log(tokenBlacklist);
    res.status(204).send(); 
}