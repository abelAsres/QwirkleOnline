const isLoggedIn=(req,res,next)=>{
    if (req.session.userInfo){
        console.log('user authenticated');
        next();
    }else{
        console.log('user is not authenticated');
        if(req.query.id){
            console.log('redirect with gameID');
            res.redirect("/login?gameId="+req.query.id);
        }
        else {
            res.redirect("/login");
        }
    }
}

module.exports=isLoggedIn;