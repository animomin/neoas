(function(){
    "use strict";

    var sckNeo = function (){
      var _this = this;

      _this.socket = io.connect();

      _this.module = null;

      _this.msg = {
        send : null,
        recive : null,
        callback : null
      };

      _this.commandTimer = {
        timer : null,
        Start : function(cb){
          console.log('timer start');
          console.log(this);
          _this.commandTimer.timer = setTimeout(function(){
            _this.commandTimer.Stop(true,cb);
            }, 10000);
        },
        Stop : function(o, cb){
          if(o){
            neoNotify.Show({
              title : '실시간 명령 실행',
              text : "명령요청 시간이 초과했습니다. 인터넷속도, 사용자의 컴퓨터 상황에 따라 명령전달 소요시간이 길어질 수 있습니다.",
              type : 'error',
              desktop : true
            });

            /**
             * LIVE 명령어 초기화
             */
            _this.socket.emit(SOCKETEVENT.MEMBER.UNLIVEAS, {
                member : _this.msg.send.LIVEAS.member,
                CLIENT : _this.msg.send.id
            });
          }
          clearTimeout(_this.commandTimer.timer);
          if(typeof cb === 'function') return cb();
          else return;
        }
      };

      /**
       * SOCKET SERVER CONNECT
       */
      _this.socket.on(SOCKETEVENT.CONNECT, function(){
          _this.socket.emit(SOCKETEVENT.MEMBER.JOIN, {id : neo.user.USER_ID, area : neo.user.user_area});
          _this.socket.emit('version',{mobile : 'android'});
      });

      /**
       * SOCKET SEND CLIENTS
       */
      _this.socket.on(SOCKETEVENT.MEMBER.CLIENTS, function(data){
          console.log(data);
          if(_this.module){
            if(typeof _this.module.events.onClients === 'function'){
              _this.module.events.onClients(data);
            }
          }
          // NeoAS.SckEvent.onClients(data.CLIENTS);
      });

      /**
       * SOCKET SEND LIVEAS RESULT
       */
      _this.socket.on(SOCKETEVENT.MEMBER.LIVEAS, function(data){
          console.log(data);
          var __this = $.neoSocket;
          if(__this.module){
            if(typeof __this.module.Live.Receive === 'function'){
              __this.module.Live.Receive(data);
            }
          }
      });

      /**
       * SOCKET SEND CLIENT ALIVE
       */
      _this.socket.on(SOCKETEVENT.MEMBER.ALIVE, function(data){
          console.log(data);
          var __this = $.neoSocket;
          if (typeof __this.msg.callback === 'function') {
            __this.msg.callback(data);
          }
      });

      /**
       * SOCKET SEND CLIENT CHECK LIVE AS
       */
      _this.socket.on(SOCKETEVENT.MEMBER.CHECKLIVEAS, function(data){
          console.log(data);
          var __this = $.neoSocket;
          if (typeof __this.msg.callback === 'function') {
            __this.msg.callback(data);
          }
      });

      /**
       * SOCKET SEND CLIENT STATUS CHANGE
       */
      _this.socket.on(SOCKETEVENT.STATUS, function(data){
        console.log(data);
        if(_this.module){
          if(typeof _this.module.events.onChangeStatus === 'function'){
            _this.module.events.onChangeStatus(data);
          }
        }
      });

      _this.emitClients = function() {
        return _this.socket.emit(SOCKETEVENT.MEMBER.CLIENTS);
      };

      _this.emitLiveAS = function(data){
        return _this.socket.emit(SOCKETEVENT.MEMBER.LIVEAS, data);
      };

      _this.emitCheckLiveAS = function(data, callback){
        _this.msg.callback = callback;
        _this.socket.emit(SOCKETEVENT.MEMBER.CHECKLIVEAS, data);
      };

      _this.emitClientAlive = function (data, callback) {
        _this.msg.callback = callback;
        return _this.socket.emit(SOCKETEVENT.MEMBER.ALIVE, data);
      };

      _this.emitChangeStatus = function (data) {
        return _this.socket.emit(SOCKETEVENT.STATUS, data);
      };

    };

  //  $.neoSocket = sckNeo;
  var neoSocket = new sckNeo();
  $.neoSocket = neoSocket;
})(window);
