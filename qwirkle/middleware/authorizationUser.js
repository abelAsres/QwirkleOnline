// determine if user has admin privillages, or is just a regular user
const loadDashBoard = (req,res,next) =>{
    console.log('Authorizing user');
    // admin privillages for testing features
    //if (req.session.userIfo.type == 'admin'){
      //  res.render('')
    //}
    //else {
        res.render('general/dashboard',{
            title: 'User Page'
        });
    //}
}
module.exports = loadDashBoard;