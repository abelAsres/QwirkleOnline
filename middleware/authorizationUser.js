const playerRecords = require('../Models/PlayHistory');
// determine if user has admin privillages, or is just a regular user
const loadDashBoard = (req,res,next) =>{
  //console.log('Authorizing user');
  // admin privillages for testing features
  
  console.log("authorizing");
  playerRecords.find({userName:req.session.userInfo.userName})
  .then((doc)=>{
    if(doc != null){
      res.render('user/dashboard',{
        title: `${req.session.userInfo.userName} Dashboard`,
        style: 'dashboard.css',
        name: req.session.userInfo.userName,
        playerRecs:doc,
        hasPlayerRecs: true
      });
    }else{
      res.render('user/dashboard',{
        title: `${req.session.userInfo.userName} Dashboard`,
        style: 'dashboard.css',
        name: req.session.userInfo.userName,
        hasPlayerRecs: false
      })
    }
  })
}
module.exports = loadDashBoard;