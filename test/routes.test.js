const { afterAll, beforeAll } = require("@jest/globals");
const mongoose =require('mongoose'); 
const supertest = require("supertest");
const server = require('../app');
const request = supertest(server);

beforeEach(async ()=>{
    await mongoose.connect(process.env.MONGO_DB_CONNECT); 
});

afterEach(()=>{
    mongoose.connection.close();
});

test('check home route', async ()=>{
    const response =  await request.get('/');
    expect(response.statusCode).toBe(200);
})

test('check login routes', async ()=>{
    const response =  await request.get('/login');
    expect(response.statusCode).toBe(200);
    const response2 = await request.post('/login')
                    .send({
                        email:"testuser@test.com",
                        password:""
                    });
    expect(response2.statusCode).toBe(401);
    const response3 = await request.post('/login')
                    .send({
                        email:"",
                        password:"testpassword"
                    });
    expect(response3.statusCode).toBe(401);
    const response4 = await request.post('/login')
                    .send({
                        email:"abelasres",
                        password:"testpassword"
                    });
     expect(response4.statusCode).toBe(401);

     const response5 = await request.post('/login')
                    .send({
                        email:"abelasres97@gmail.com",
                        password:"abel1234"
                    });
     expect(response5.statusCode).toBe(302);
     expect(response5.res.headers.location).toBe('user/dashboard');
},60000)

test('check registration route', async ()=>{
    const response =  await request.get('/registration');
    expect(response.statusCode).toBe(200);
})