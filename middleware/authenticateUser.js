const isLoggedIn=(req,res,next)=>{
    
    /* Validation is auto true for testing
    console.log('user authenticated');
    next();
    */
    // Remove Following Section when debugging is complete
    //console.log('user authenticated');
    //next();
    //
    
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