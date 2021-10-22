const validation = require('../public/js/validation');
const invalidUserName = "testuser!!";
const validUserName = "testuser1";
const invalidEmail = "thisIs@notAnEmail";
const validEmail = "thisIs@AnEmail.com";
const validPassword = "Validpassword12!";
const invalidPasswordLong = "ThisIsTooLongForAPassword!";
const invalidPasswordShort = "12345";
const invalidPasswordChar = "Validpassword12.";


//test userName
test('user name validation', ()=>{
    expect(validation.validateUserName(invalidUserName)).toBe(false);
});

test('user name is valid', ()=>{
    expect(validation.validateUserName(validUserName)).toBe(true);
});

//test email
test('email is invalid', ()=>{
    expect(validation.validateEmail(invalidEmail)).toBe(false);
});

test('email is valid', ()=>{
    expect(validation.validateEmail(validEmail)).toBe(true);
});


//test password
test('password length', ()=>{
    expect(validation.validatePassword(invalidPasswordLong)).toBe(false);
    expect(validation.validatePassword(invalidPasswordShort)).toBe(false);
});

test('password has invalid char', ()=>{
    expect(validation.validatePassword(invalidPasswordChar)).toBe(false);
});

test('password is valid',()=>{
    expect(validation.validatePassword(validPassword)).toBe(true);
})