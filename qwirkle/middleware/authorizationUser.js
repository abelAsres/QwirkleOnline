// determine if user has admin privillages, or is just a regular user
const loadDashBoard = (req,res,next) =>{
    console.log('Authorizing user');
    // admin privillages for testing features
    //if (req.session.userIfo.type == 'admin'){
      //  res.render('')
    //}
    //else {
        console.log(req.session.userInfo);
        res.render('general/dashboard',{
            title: 'User Page',
            style: 'dashboard.css',
            name: req.session.userInfo.email
        });
    //}
}
module.exports = loadDashBoard;