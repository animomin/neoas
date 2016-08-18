var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.session.login){
    return res.redirect(page.users.login);
  }
  res.redirect(page.as.index);
});

router.get('/template/:template', function(req, res, next){
  var template = req.params.template;
      template = template.replace(/-/gim, '/');
  res.render(template, function(err, view){
    if(err) logger.error(err);
    res.send(view);
  });
});

router.get('/history', function(req, res, next){


});

module.exports = router;
