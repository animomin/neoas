var express = require('express');
var router = express.Router();

/* GET manage listing. */
router.get('/', function (req, res, next) {
  if (!req.session.login) {
    return res.redirect('/' + page.users.login);
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
    return res.redirect('/' + page.users.login);
  }
  if (req.query.id) {
    member.GetProjectDetail(req, function (result) {
      console.log(JSON.stringify(result.data[0][0], null, 4));
      var projectFiles = [];
      var path = global.path.join(__dirname, '../public/project/', req.query.id);
      projectFiles = fs.readdirSync(path);
      return res.render('project', {
        title: '프로젝트 수정 - (주)네오소프트뱅크',
        menu: 8011,
        body: 'fixed-nav gray-bg',
        user: req.session.user,
        projectid: result.data[0][0]['인덱스'],
        newproject: false,
        project: result.data,
        projectFiles: projectFiles
      });
    });
  } else {
    member.GetNewProjectID(function (result) {
      return res.render('project', {
        title: '프로젝트 등록 - (주)네오소프트뱅크',
        menu: 8011,
        body: 'fixed-nav gray-bg',
        user: req.session.user,
        projectid: result.data[0]['ID'] + 1,
        newproject: true
      });
    });
  }
});

router.post('/new', function (req, res, next) {

  var form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {
    console.log('files', files);
    console.log('fields', fields);
    console.log('req', req.body);
    var param = {};
    param.body = {};

    for (var key in fields) {
      param.body[key] = fields[key][0];
    }

    if (param.body._METHOD === 'POST') {
      member.SaveNewProject(param, _SaveFiles);
    } else if (param.body._METHOD === 'PUT') {
      member.UpdateProject(param, _SaveFiles);
    }

    function _SaveFiles(result) {
      if (!result.err && result.data[0].Message === 'SUCCESS') {

        member.GetNewProjectID(function (_result) {
          var projectid = _result.data[0]['ID']; //왜 1증가된값으로 넘어오는지 모르겠음.
          var uploadFile = files['project-file[]'];
          var uploadPath = global.path.join(__dirname, '../public/project/');
          if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
          uploadPath += "/" + projectid;
          if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

          console.log('file upload path is ', uploadPath);

          uploadFile.forEach(function (file) {
            var uploadFilePath = global.path.join(uploadPath, file.originalFilename);
            var buffer = fs.readFileSync(file.path);
            fs.writeFile(uploadFilePath, buffer);
          });

          res.redirect('/project/detail/' + projectid);
        });
      }
    }

  });
  // console.log(req.body);
  // member.SaveNewProject(req, function (result) {
  //   if (!result.err && result.data[0].Message === 'SUCCESS') {
  //     //요기서 무브파일해야함      
  //     if(req.body['project-uploaded-file']){
  //       var files = typeof req.body['project-uploaded-file'] === 'object' ? req.body['project-uploaded-file'] : [req.body['project-uploaded-file']];
  //       var oldPath = global.path.join(__dirname, '../public/project/', "user_" + req.session.user.USER_ID);
  //       var movePath = global.path.join(__dirname, '../public/project/', req.body['project-id']);
  //       if (!fs.existsSync(movePath)) fs.mkdirSync(movePath);
  //       files.forEach(function (file) {
  //         console.log('target file is', file);
  //         fs.renameSync(oldPath + '/' + file, movePath + '/' + file);
  //       });
  //       fs.rmdirSync(oldPath);
  //     }
  //   }
  //   res.redirect('/project');
  // });
});

router.get('/detail/:projectid', function (req, res, next) {
  if (!req.session.login) {
    return res.redirect('/' + page.users.login);
  }
  member.GetProjectDetail(req, function (result) {

    var projectFiles = [];
    var path = global.path.join(__dirname, '../public/project/', req.params.projectid);
    if (fs.existsSync(path)) {
      projectFiles = fs.readdirSync(path);
    }
    // console.log(projectFiles);
    return res.render('project', {
      title: '프로젝트 상세 - (주)네오소프트뱅크',
      menu: 8012,
      body: 'fixed-nav gray-bg',
      user: req.session.user,
      project: result.data,
      commenttype: req.query.ct || 0,
      projectFiles: projectFiles
    });
  });

});

router.put('/detail/:projectid', function(req, res, next){
  member.UpdateProject(req, function(result){
    res.send(result);
  });
});

router.delete('/detail/:projectid', function(req, res, next){
  member.DeleteProject(req, function(result){
    res.send(result);
  });
});

router.get('/list', function (req, res, next) {
  console.log(req.query);
  member.GetProjectList(req, function (result) {
    res.send(result);
  });
});

router.post('/comment', function (req, res, next) {
  console.log(req.param, req.body, req.query);
  if (req.body._METHOD) {
    if (req.body._METHOD === 'PUT') {
      member.EditProjectComment(req, function (result) {
        console.log('/project/detail/' + req.body.projectid + "?ct=" + req.body.commentType);
        res.redirect('/project/detail/' + req.body.projectid + "?ct=" + req.body.commentType);
      });
    }
  } else {
    member.AddProjectComment(req, function (result) {
      res.redirect('/project/detail/' + req.body.projectid + "?ct=" + req.body.commentType);
    });
  }
});
router.delete('/comment', function (req, res, next) {
  member.DelProjectComment(req, function (result) {
    res.send(result);
  });
});


router.post('/upload', function (req, res, next) {
  var form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {
    // console.log(files);
    var uploadFile = files['project-file'][0];
    var uploadPath = global.path.join(__dirname, '../public/project/');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    uploadPath += "/" + fields.projectid;
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    var uploadFilePath = global.path.join(uploadPath, uploadFile.originalFilename);


    fs.readFile(uploadFile.path, function (err, data) {
      fs.writeFile(uploadFilePath, data, function (err) {
        if (err) console.log('PROJECT FILE UPLOAD FAILED ', err);
        res.send({ err: err, files: files['project-file'] });
      });
    });
  });

  router.delete('/upload', function (req, res, next) {
    var removeFile = req.body.removeFile;
    var removePath = global.path.join(__dirname, '../public/project/', req.body.projectid);
    var removeFilePath = global.path.join(removePath, removeFile);

    fs.unlink(removeFilePath, function () {
      res.send({});
    });

  });
});


module.exports = router;
