var express = require('express');
var router = express.Router();

/* GET manage listing. */
router.get('/', function(req, res, next) {
  if(!req.session.login){
    return res.redirect(page.users.login);
  }
  res.render('worklist', {
    title : '업무보고 - (주)네오소프트뱅크',
    menu : 701,
    body : 'fixed-nav gray-bg',
    user : req.session.user
  })
});

router.get('/today', function(req, res, next){
  member.GetTodayWorkList(req, function(result){
    res.send(result);
  });
})

router.get('/dailylist', function(req, res, next){
  member.GetDailyReportsList(req, function(result){    
    res.send(result);
  });
});

router.post('/save', function(req, res, next){
  member.SaveDailyReport(req, function(result){
    if(!result.err){
      if(result.data[0].Message === 'SUCCESS'){
        member.SaveDailyReportSub(req, result.data[0].index, function(result){
          res.send(result);
        });
      }
    }else{
      res.send(result);
    }
  });
});

module.exports = router;
