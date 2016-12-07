var express = require('express');
var router = express.Router();

/* GET manage listing. */
router.get('/', function(req, res, next) {
  if(!req.session.login){
    return res.redirect(page.users.login);
  }
  res.render('manage', {
    title : '거래처관리 - (주)네오소프트뱅크',
    menu : 601,
    body : 'fixed-nav',
    user : req.session.user
  })
});

router.get('/hosplist', function(req, res, next){
  member.GetHospitalList(req, function(result){
    res.send(result);
  });
});

router.get('/hospinfo', function(req, res, next){
  member.GetHospitalInfo(req, function(result){
    res.send(result);
  });
});

router.post('/hospinfo', function(req, res, next){
  member.SaveHospitalInfo(req, function(result){
    res.send(result);
  });
});


router.get('/history', function(req, res, next){
  member.GetHospitalHistoryList(req, function(result){
    res.send(result);
  });
});

router.post('/history', function(req, res, next){
  member.SaveHospitalHistory(req, function(result){
    res.send(result);
  });
});

router.put('/history', function(req, res, next){
  member.RemoveHospitalHistory(req, function(result){
    res.send(result);
  });
});

router.get('/history/contents', function(req, res, next){
  member.GetHospitalHistoryDetail(req, function(result){
    res.send(result);
  });
});

module.exports = router;
