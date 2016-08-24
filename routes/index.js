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

router.get('/versions', function(req, res, next){
  console.log(req.query);
  emrs[req.query.emr]._getVersions(function(err, data){
    var result = {};
    if(err){
      logger.error('EMR VERSION ERROR ', err);
      result.err = err;
      result.data = null;
    }else if(!data || data.length <= 0){
      result.err = 'NODATA';
      result.data = null;
    }else{
      result.err = null;
      result.data = data;
    }
    res.send(result);
  });
});

router.get('/apps/:mobile/:version', function(req, res, next){
  var file = 'public/apps/' + req.params.mobile + '/' + req.params.version + '/neoas';
  file += (req.params.mobile === 'android' ? '.apk' : '.ipa');
  res.download(file);
});

router.get('/manage/:mode', function(req, res,next){
  var q;
  if(req.params.mode === 'area') q = querys16._RankArea;
  if(req.params.mode === 'member') q = querys16._RankMember;
  if(req.params.mode === 'hosp') q = querys16._RankHosp;
  if(req.params.mode === 'emr') q = querys16._RankEmr;
  client.GetRank(q,req, function(result){
    res.send(result);
  });
});


module.exports = router;
