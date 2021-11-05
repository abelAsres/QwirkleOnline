const { afterAll, beforeAll } = require("@jest/globals");
const mongoose =require('mongoose'); 
const supertest = require("supertest");
const server = require('../app');
const request = supertest(server);
const userModel = require('../Models/User');


beforeAll(async ()=>{
    await mongoose.connect('mongodb+srv://abelasrestestDB:WPzy6gaWVlrNriGB@cluster0.5bdmu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'); 
});

afterAll(async ()=>{
    await userModel.deleteOne({userName:'testuser1'});
    await mongoose.connection.close();
    
});
//testing home requests
test('check home route', async ()=>{
    const response =  await request.get('/');
    expect(response.statusCode).toBe(200);
})

//testing registration requests
test('check registration route', async ()=>{
    const response =  await request.get('/registration');
    expect(response.statusCode).toBe(200);

   
    const response2 = await request.post('/registration')
    .send({
        userName:"testuser1",
        email:"testmail@gmail.com",
        password:"testpassword1",
        checkPassword:"testpassword1"
    });
<<<<<<< HEAD
    expect(response2.statusCode).toBeGreaterThanOrEqual(200);
    expect(response2.res.headers.location).toBe('/login?showModal=true');
=======

    const user =  await userModel.findOne({email:"testmail@gmail.com"});

    expect(user.userName).toBe('testuser1');
    expect(user.email).toBe('testmail@gmail.com');
    //expect(response2.statusCode).toBe(200);
    //expect(response2.res.headers.location).toBe('/login?showModal=true');

>>>>>>> 361eb4d088ca380770bf67f266306522e59bc9e9
},60000)

//testing login requests
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
                        email:"testmail@gmail.com",
                        password:"testpassword1"
                    });
     expect(response5.statusCode).toBe(302);
     expect(response5.res.headers.location).toBe('user/dashboard');
     
},60000)
/*
test('update username', async()=>{
  const response = await request.put('/user/update')
                .send({
                    userName: 'testUserUpdated',
                    password:'testpassword1'
                });
    expect(response.statusCode).toBe(204);
    expect(userModel.findOne({userName: 'testUserUpdated'}).userName).toBe('testUserUpdated');
})*/