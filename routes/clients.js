var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  // res.send('respond with a resource');
  var ip = req.headers["X-Forwarded-For"] || req.headers["x-forwarded-for"] || req.client.remoteAddress;
  // console.log(ip);
  if (ip.indexOf('211.238.39.148') >= 0 || ip.indexOf('::1') >= 0) {
    res.render('client', params.GetASClientParams(req));
    //  res.render('client/accept');
    // res.render('client/client_index');
  } else {
    res.render('client/main', params.GetASClientParams(req));
  }

});

router.get('/index', function (req, res, next) {
  var ip = req.headers["X-Forwarded-For"] || req.headers["x-forwarded-for"] || req.client.remoteAddress;
  console.log(ip);
  console.log(req.query.ver);
  if (ip.indexOf('211.238.39.148') >= 0 || ip.indexOf('::1') >= 0) {
    //res.render('client/accept');
    // res.render('client/accept');
    if (isNaN(req.query.ver) || parseInt(req.query.ver) >= 10) {
      res.render('client/accept');
    } else {
      res.render('client/accept_old');
    }
  } else {
    //res.render('client/main', params.GetASClientParams(req));
  }
});

router.get('/chat', function (req, res, next) {
  res.render('client/chat');
});



router.get('/new', function (req, res, next) {
  // res.send('respond with a resource');
  var ip = req.headers["X-Forwarded-For"] || req.headers["x-forwarded-for"] || req.client.remoteAddress;
  console.log(ip);
  //if(ip.indexOf('211.238.39.148') >= 0 || ip.indexOf('::1') >= 0 ){
  // res.render('client', params.GetASClientParams(req));
  res.render('client/accept');
  //}else{
  //  res.render('client/main', params.GetASClientParams(req));
  //}

});


// AS요청 접수
router.post('/require', function (req, res, next) {
  var form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {
    logger.info('AS Require insert ::: ');
    logger.info(err, fields, files);
    var img = files.uploadimage[0];
    fs.readFile(img.path, function (err, data) {
      // var path = "./public/uploads/" + img.originalFilename;
      var path = global.path.join(__dirname, '../public/uploads', img.originalFilename);
      fs.writeFile(path, data, function (err) {
        if (err) logger.error('(AS Require) IMAGE UPLOAD FAILED :: ', err);
        if (!err) {
          fields.comment = '<p><img class="img-preview" src="uploads/' + img.originalFilename +
            '" data-filename="' + img.originalFilename +
            '" style="width: 100%;"></p>' + fields.comment;
        }
        client.Accept(fields, function (err, data) {
          if (err) logger.error('AS Require insert FAILED :: ', err);
          if (!err) {
            res.render('client/room', { bodyClass: "", index: data[0].index, area: fields.area, data: fields });
          }
        });
      });
    });
  });
});

// AS요청건 캡쳐파일 업로드
router.post('/upload', function (req, res, next) {
  var form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {
    logger.info('Remote Capture Image Upload ACCESS ::');
    logger.info(err, fields, files);
    var img = files.capture[0];
    fs.readFile(img.path, function (err, data) {
      // var path = "./public/uploads/" + img.originalFilename;
      if (!fs.existsSync('public/uploads')) fs.mkdirSync('public/uploads');
      var path = global.path.join(__dirname, '../public/uploads', img.originalFilename);
      fs.writeFile(path, data, function (err) {
        if (err) {
          logger.error('Remote Capture Image FAILED :: ', err);
          res.send('500');
        } else {
          res.send('200');
        }
      });
    });
  });
});

/**
 * Get AS LIST
 */
router.get('/list', function (req, res, next) {
  client.GetASList(req, function (result) {
    res.send(result);
  });
});

/**
 * Get AS Item
 */
router.get('/item', function (req, res, next) {
  client.GetASItem(req, function (result) {
    res.send(result);
  });
});

/**
 * PUT AS data
 */
router.put('/updateas', function (req, res, next) {
  client.UpdateAs(req.body, function (result) {
    res.send(result);
  });
});

/**
 * PUT AS Context
 */
router.put('/context', function (req, res, next) {
  console.log(req.body);
});

/**
 * PUT AS ACCEPT CANCEL
 */
router.put('/cancelas', function (req, res, next) {
  client.Cancel(req.body, function (result) {
    res.send(result);
  });
});

module.exports = router;
