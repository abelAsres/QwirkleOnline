const supertest = require("supertest");
const server = require('../app');
const request = supertest(server);

test('check home route', async ()=>{
    const response =  await request.get('/');
    expect(response.statusCode).toBe(200);
})


test('check login route', async ()=>{
    const response =  await request.get('/login');
    expect(response.statusCode).toBe(200);
    const response2 = await request.post('/login')
                    .send({
                        userName:'',
                        password:''
                    });
    expect(response2.).toBe(409);
})

test('check registration route', async ()=>{
    const response =  await request.get('/registration');
    expect(response.statusCode).toBe(200);
})