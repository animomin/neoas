var express = require('express');
var router = express.Router();

/* GET manage listing. */
router.get('/', function (req, res, next) {
  if (!req.session.login) {
    return res.redirect(page.users.login);
  }
  res.render('project', {
    title: '프로젝트 - (주)네오소프트뱅크',
    menu: 801,
    body: 'fixed-nav gray-bg',
    user: req.session.user
  });
});

router.get('/new', function (req, res, next) {
  if (!req.session.login) {
    return res.redirect('../' + page.users.login);
  }
  member.GetNewProjectID(function (result) {
    return res.render('project', {
      title: '프로젝트 등록 - (주)네오소프트뱅크',
      menu: 8011,
      body: 'fixed-nav gray-bg',
      user: req.session.user,
      projectid : new Date().GetToday('YYYY') + '-' + result.data[0]['ID'],
      newproject : true
    });
  });
});

router.get('/detail', function (req, res, next) {
  if (!req.session.login) {
    return res.redirect('../' + page.users.login);
  }
  return res.render('project', {
    title: '프로젝트 상세 - (주)네오소프트뱅크',
    menu: 8012,
    body: 'fixed-nav gray-bg',
    user: req.session.user
  });
});

router.get('/list', function (req, res, next) {
  console.log(req.query);
  member.GetProjectList(req, function (result) {
    res.send(result);
  });
});


router.post('/upload', function(req, res, next){
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files){
    console.log(files);
    var uploadFile = files['project-file'][0];
    var uploadPath = global.path.join(__dirname, '../public/project');
    var uploadFilePath = global.path.join(uploadPath, uploadFile.originalFilename);
    if(!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

    fs.readFile(uploadFile.path, function(err, data){
      fs.writeFile(uploadFilePath, data, function(err){
        if(err) console.log('PROJECT FILE UPLOAD FAILED ', err);
        res.send({err : err});
      });
    });    
    
  });    
});


module.exports = router;
