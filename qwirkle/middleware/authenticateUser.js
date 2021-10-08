const isLoggedIn=(req,res,next)=>{
    if (req.session.userInfo){
        console.log('user authenticated');
        next();
    }else{
        console.log('user is not authenticated');
        res.redirect("/login");
    }
}

module.exports=isLoggedIn;