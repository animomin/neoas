var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 * LOGIN ROUTER
 */
router.get('/login', function(req, res, next){
  res.render(page.users.login, params.GetLoginParam(req.session.login));
});
router.get('/login/do', function(req, res, next){
  member.login(req, function(result){
    if(result.err){
      logger.error('login/do FAILED :: ', result.err);
      req.session.login = false;
    }else{
      var user = result.data[0];
      req.session.login = true;
      req.session.user = user;
      logger.info('login/do SUCCESS :: ' + user.USER_ID + ' ' + user.USER_NAME);
    }
    return res.redirect('/');
  });
});

module.exports = router;
