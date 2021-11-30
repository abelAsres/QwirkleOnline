// determine if user has admin privillages, or is just a regular user
const loadDashBoard = (req,res,next) =>{
  //console.log('Authorizing user');
  // admin privillages for testing features
  res.render('user/dashboard',{
    title: `${req.session.userInfo.userName} Dashboard`,
    style: 'dashboard.css',
    name: req.session.userInfo.userName
  });
}
module.exports = loadDashBoard;