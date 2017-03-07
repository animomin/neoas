var ConstServiceStatus = {
  RECEIPT: 0,
  CONFIRM: 1,
  TAKEOVER: 2,
  TAKEOVERCONFIRM: 3,
  DONE: 4,
  CANCEL: 5
};
var NeoClient = {
  socket: null,
  status: false,
  room: null,
  area: null,
  data: null,
  summary: null,
  timer: null,
  receiveData: null,
  serviceStatus: null,
  _connect: function () {
    var _this = this;
    if (typeof io === 'undefined') {
      return 'socket is undefined';
    }

    _this.socket = io.connect();
    _this.socket.on('connect', function () {
      console.log('Socket is connected!');
      //_this.status = true;
      // _this.socket.emit('join', {type : 'CLIENT', id : _this.room, area: _this.area});
      _this.summary = _this.room + ' ';
      if (_this.data.astype[0] == 1) {
        _this.summary += "[장애] ";
      } else if (_this.data.astype[0] == 2) {
        _this.summary += "[사용법] ";
      } else {
        _this.summary += "[선택없음] ";
      }
      _this.summary += _this.data.hospname[0];


      _this.socket.emit(SOCKETEVENT.CLIENT.JOIN, { id: _this.room, area: _this.area, data: _this.summary, status: _this.status });
      _this.serviceStatus = ConstServiceStatus.RECEIPT;
      //_this._ServiceTimeout();
    });

    _this.socket.on(SOCKETEVENT.CLIENT.JOIN, function (data) {
      _this.status = true;
    });
    _this.socket.on(SOCKETEVENT.CLIENT.LIVEAS, function (data) {
      _this.receiveData = data;
      $('#as_command').html(data.params);
      $('title').html(data.params);
      $('#log').html(data.params);
    });
    _this.socket.on(SOCKETEVENT.CLIENT.LEAVE, function (data) {
      if (!data.room['neo' + _this.room]) {
        $('#as_result').val('DISCONNECTED');
      }
    });
    _this.socket.on(SOCKETEVENT.STATUS, function (data) {
      // var _this = NeoClient;
      console.log(data);
      var comment = "";
      _this.serviceStatus = data.STATUS;

      if (parseInt(_this.serviceStatus) === ConstServiceStatus.CANCEL) {
        alert( " AS예약접수가 취소되었습니다 \n " + data.item.message);
        setTimeout(function () {
          NeoClient._DisConnect(true);
          location.href = '/clients';
        }, 1000);
        return;
      }

      if (parseInt(_this.serviceStatus) === ConstServiceStatus.CONFIRM) {
        comment = "▷ 담당자가 확인하였습니다.";
        $('#confirm-time').html('확인자 : ' + data.item.확인자 + '<br>연락처 : ' + data.item.확인자연락처 + '<br>' + data.item.확인일자);
        $('#confirm-person').text('AS요청을 확인하였습니다.');
        $('#confirm').removeClass('hidden').addClass('animated fadeInUp');
      } else if (parseInt(_this.serviceStatus) === ConstServiceStatus.TAKEOVER) {
        comment = "▷ AS요청이 전산에 등록되었습니다.";
        $('#takeover-time').html('접수자 : ' + data.item.인계자 + '<br>연락처 : ' + data.item.인계자연락처 + '<br>' + data.item.인계일자);
        $('#takeover-person').text(comment);
        $('#takeover').removeClass('hidden').addClass('animated fadeInUp');
      } else if (parseInt(_this.serviceStatus) === ConstServiceStatus.TAKEOVERCONFIRM) {
        comment = "▷ AS담당자가 전산에서 AS요청을 확인하였습니다.";
        $('#takeoverconfirm-time').html('AS담당자 : ' + data.item.처리자 + '<br>연락처 : ' + data.item.처리자연락처 + '<br>' + data.item.처리일자);
        $('#takeoverconfirm-person').text(comment);
        $('#takeoverconfirm').removeClass('hidden').addClass('animated fadeInUp');
      } else if (parseInt(_this.serviceStatus) === ConstServiceStatus.DONE) {
        comment = "▷ 요청사항을 처리하였습니다.";
        $('#done-time').html('처리자 : ' + data.item.처리자 + '<br>연락처 : ' + data.item.처리자연락처 + '<br>' + data.item.처리일자);
        $('#done-person').text(comment);
        $('#done').removeClass('hidden').addClass('animated fadeInUp');
        $('.as-cancel').addClass('hidden');
        $('.as-done').removeClass('hidden');
        //$('title').html('LIVEASEND');
        setTimeout(function () {
          NeoClient._DisConnect(true);
          location.href = '/clients';
        }, 60000);
        return;
      }

      // _this._ServiceTimeout();
      // var browser = parseInt(sessionStorage.getItem('browser'));
      // if(browser > 9){
      //   $('.middle-box').removeClass('slideInRight').addClass('slideOutLeft');
      //   $('.middle-box').one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
      //   function(e) {
      //     $('title').html("STATUSUPDATE" + comment);
      //     // $('#as-status').find('p').text(comment);
      //     $('.middle-box').removeClass('slideOutLeft').addClass('slideInRight');
      //   });
      // }else{
      //   $('title').html("STATUSUPDATE" + comment);
      //   // $('#as-status').find('p').text(comment);
      // }
      $('title').html("STATUSUPDATE" + comment);


    });
    _this.socket.on('message', function (data) {
      console.log(data);
    });
  },
  _AcceptCancel: function () {
    var comment = $('#comment').summernote('code');
    $.ajax({
      url: '/clients/cancelas',
      data: {
        status: 5,
        comment: comment,
        id: NeoClient.room
      },
      dataType: 'json',
      method: 'PUT',
      async: false,
      success: function (data) {
        NeoClient._DisConnect(true);
      },
      complete: function () {
        location.href = '/clients';
      }
    });
  },
  _DisConnect: function (force) {
    // this.socket.emit('client:leave' , {roomName : this.room});
    //this.socket.disconnect();
    //io.disconnect();
    if (force) {
      this.socket.emit(SOCKETEVENT.CLIENT.CANCEL, { id: this.room });
    }
    this.socket.disconnect();
  },
  _SendLiveAsResult: function (r) {
    this.socket.emit(SOCKETEVENT.CLIENT.LIVEAS, {
      id: this.room,
      RESULT: r,
      MEMBER: NeoClient.receiveData.member
    });
  },
  _ServiceTimeout: function () {
    var _this = NeoClient;
    var timer = 0;
    if (_this.serviceStatus === ConstServiceStatus.RECEIPT) {
      timer = 1000 * 60 * 10;
    } else if (_this.serviceStatus === ConstServiceStatus.CONFIRM) {
      timer = 1000 * 60 * 30;
    } else {
      return false;
    }

    if (_this.timer) {
      clearTimeout(_this.timer);
      _this.timer = null;
    }

    _this.timer = setTimeout(function () {
      var _this = NeoClient;
      neoAJAX.GetAjax({
        url: 'clients/autostatus',
        data: {
          index: _this.room
        },
        dataType: 'json',
        async: true,
        method: 'PUT',
        beforeSend: function () { },
        success: function (opt, _records) {

        },
        callback: function () {

        }
      })
      var sendData = {
        item: _this.room,
        status: ConstServiceStatus.TAKEOVER,
        emergency: 0,
        manager: {
          USER_ID: 19,
          USER_NAME: '관리자',
          user_area: '0000'
        },
        modify: false,
        confirm: 'admin'
      };
      $.getJSON('clients/status', sendData, function (data) {
        var sendData = {
          clientid: _this.room,
          area: _this.area,
          status: ConstServiceStatus.TAKEOVER,
          preStatus: _this.serviceStatus
        };
        _this.socket.emit("AutoStatusUpdate", sendData);
      });
    }, timer);
  }
};
