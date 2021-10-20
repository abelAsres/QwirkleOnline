
const ck_userName= /^[A-Za-z0-9]{6,12}$/;
const ck_password =  /^[A-Za-z0-9!@$%&*_]{8,20}$/;
const ck_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

function validateUserName (name){
    return ck_userName.test(name); 
}

function validateEmail (email){    
    return ck_email.test(email);
}

function validatePassword (password){
    return ck_password.test(password);
}

function verifyPassword (checkPassword,password){
    return checkPassword.localeCompare(password) == 0;
}


module.exports ={
validateUserName,
validateEmail,
validatePassword,
verifyPassword    
}