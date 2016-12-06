var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:menu', function(req, res, next) {
    if (!req.session.login) return res.redirect('/');
    if(req.params.menu === 'history'){
      client.GetASHistory(req, function(result) {
          res.send(result);
      });
    }else{
      res.render('as', params.GetASParams(req));
    }
});

router.get('/history', function(req, res, next) {  
    client.GetASHistory(req, function(result) {
        res.send(result);
    });
});

module.exports = router;
