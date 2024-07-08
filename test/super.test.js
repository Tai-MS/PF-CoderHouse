// test.js (actualizado)
import * as chai from 'chai';
import supertest from 'supertest';
import { constants } from '../src/utils.js';

const expect = chai.expect;
const requester = supertest(`http://localhost:${constants.PORT}`);

describe('Testing Get Products', function()  {
    this.timeout(5000); 
    describe('Products Test', () => {
        it('EP: /api/ should return the products list.', async () => {
            // Primero autenticamos al usuario
            const userMock = {
                email: 'test@gmail.com',
                password: 'test'
            };
            const loginResponse = await requester.post('/user/login').send(userMock);
            expect(loginResponse.status).to.be.equal(302);

            // Obtenemos el token de autenticación de la cookie
            const cookies = loginResponse.headers['set-cookie'];
            const token = cookies.find(cookie => cookie.startsWith('auth-token')).split(';')[0].split('=')[1];
            console.log(token);
            expect(token).to.be.a('string');

            // Luego hacemos la solicitud para obtener los productos, usando la cookie 'auth-token'
            const { statusCode, ok, body } = await requester.get('/api/')
                .set('Cookie', `auth-token=${token}`); // Pasamos el token en la cookie
            console.log(statusCode);
            console.log(ok);
            console.log(body);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(body).to.be.an('array'); // Asumiendo que el resultado es una lista de productos
        });
    });
});

describe('SignUp Test', () => {
    describe('Users test.', () => {
        it('EP: /user/signup should return the new user', async () => {
            const userMock = {
                email: 'test@gmail.com',
                firstName: 'test',
                lastName: 'test',
                age: 1,
                password: 'test',
                confirmPass: 'test'
            };
            const { statusCode, ok, body } = await requester.post('/user/signup').send(userMock);
            console.log(statusCode);
            console.log(ok);
            console.log(body);
            expect(statusCode).to.be.equal(302);
        });
    });
});
