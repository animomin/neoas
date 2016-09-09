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

router.get('/files', function(req, res, next){
  // var filePath = 'public/';
  // filePath += req.query.type === 'Android' ? 'apps/android/' : '';
  // filePath += req.query.type === 'Agent' ? 'agent/' : '';
  // filePath += req.query.type === 'WebPage' ? 'settings/' : '';
  fs.readFile(global.path.join(__dirname, '../public/settings/','upload'),'utf-8', function(error, data) {
    if(error) throw (err);
    var uploads = JSON.parse(data);
    res.send(uploads[req.query.type]);
    // fs.writeFile('public/settings/upload', JSON.stringify(uploads), 'utf-8', function(err){
    //   if(err) throw err;
    //   console.log('complete');
    // });
  });
});

router.post('/files', function(req, res, next){
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files){
    var uploads = fs.readFileSync(global.path.join(__dirname, '../public/settings/','upload'),'utf-8');
        uploads = JSON.parse(uploads);
    var newData = null;
    uploads[fields.category[0]].files.forEach(function(item,index){
      if(item.filename === files.file[0].originalFilename){
        uploads[fields.category[0]].files[index].filename = files.file[0].originalFilename;
        uploads[fields.category[0]].files[index].version = fields.version[0];
        uploads[fields.category[0]].files[index].date = fields.update[0];
        uploads[fields.category[0]].files[index].uploader.USER_ID = req.session.user.USER_ID;
        uploads[fields.category[0]].files[index].uploader.user_name = req.session.user.USER_NAME;
        newData = uploads[fields.category[0]].files[index];
      }
    });
    if(!newData){
      newData = {
        "folder" : fields.folder[0],
        "filename" : files.file[0].originalFilename,
        "version"  : fields.version[0],
        "date" : fields.update[0],
        "uploader" : {
          "USER_ID" : req.session.user.USER_ID,
          "user_name" : req.session.user.USER_NAME
        }
      };
      uploads[fields.category[0]].files.push(newData);
    }


    var upPath = 'public/';
    if(fields.category[0] === 'Android') upPath = global.path.join(__dirname, '../public/','apps/android/'); //upPath += 'apps/android/';
    if(fields.category[0] === 'Agent') upPath = global.path.join(__dirname, '../public/','agent/');   // += 'agent/';
    if(fields.category[0] === 'WebPage') upPath = global.path.join(__dirname, '../public/','settings/');//upPath += 'settings/';
    upPath += newData.folder;

    if(!fs.existsSync(upPath)){
      fs.mkdirSync(upPath);
    }

    upPath += '/' + newData.filename;

    fs.readFile(files.file[0].path, function(err, data){
      fs.writeFile(upPath, data, function(err){
        if(err){
          res.send('500');
        }else{
          fs.writeFile(global.path.join(__dirname, '../public/settings/','upload'), JSON.stringify(uploads), 'utf-8', function(err){
            if(err) throw err;
            res.send('200');
          });
        }
      });
    });
  });
});

router.get('/download/:category', function(req,res,ext){
  var file = "";
  if(req.params.category === 'android') file = global.path.join(__dirname, '../public/','apps/android/'); //file += 'apps/android/';
  if(req.params.category === 'agent') file = global.path.join(__dirname, '../public/','agent/'); // file += 'agent/';
  if(req.params.category === 'webpage') file = global.path.join(__dirname, '../public/','settings/'); //file += 'settings/';

  file += req.query.fdr + '/';
  file += req.query.fle;

  res.download(file);

});

router.get('/apps/:mobile/:version', function(req, res, next){
  // var file = 'public/apps/' + req.params.mobile + '/' + req.params.version + '/neoas';
  var file = global.path.join(__dirname, '../public/apps/', req.params.mobile + '/' + req.params.version + '/neoas');
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
