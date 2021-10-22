const supertest = require("supertest");
const server = require('../app');
const request = supertest(server);

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
})

test('check registration route', async ()=>{
    const response =  await request.get('/registration');
    expect(response.statusCode).toBe(200);
})