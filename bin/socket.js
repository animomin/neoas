(function(){
    "use strict";

    var SOCKETEVENT = {
      VERSION : 'version',
      DISCONNECT : 'disconnect',
      STATUS : 'status',
      MEMBER : {
        JOIN : 'manager:join',
        LEAVE : 'manager:leave',
        CLIENTS : 'manager:clients',
        ALIVE : 'manager:alive',
        LIVEAS : 'manager:liveas',
        CHECKLIVEAS : 'manager:checkliveas',
        UNLIVEAS : 'manager:unliveas'
      },
      CLIENT : {
        JOIN : 'client:join',
        LEAVE : 'client:leave',
        LIVEAS : 'client:liveas',
        CANCEL : 'client:cancel'
      }
    };

    var io = global.io;

    var extend = util._extend;

    var socketManager = {
      slot : null,
      add : function(data,socket,callback){

        // var newItem = this.find(data.id);
        // if(newItem){
        //   newItem.socket = socket.id;
        //   newItem.connectTime = datetime.create().format('Y-m-d H:M:S');
        // }else{
        var newItem = {
            id : data.id,
            socket : socket.id,
            area : data.area,
            connectTime : datetime.create().format('Y-m-d H:M:S'),
            liveas : {
              member : null,
              member_socket : null,
              command : null,
              params : null,
              oCommand : null,
              oParams : null,
              timer : null
            }
          };
          this.slot.push(newItem);
        // }

        console.log(this.slot);

        if(typeof callback === 'function'){
          return callback(newItem);
        }else{
          return;
        }

      },
      remove : function(id, callback){
        var _this = this;

        _this.slot = _this.slot.filter(function(item, index){
          if(item.id !== id){
            return item;
          }
        });

        console.log(this.slot);

        if(typeof callback === 'function'){
          return callback();
        }else{
          return;
        }
      },
      find : function(id, callback){
        var _this = this;

        // var selItem = this.slot.find(function(item, index){
        //                 if(parseInt(item.id) === parseInt(id)){
        //                   return {selItem : item , index : index};
        //                 }
        //               });
        var selItem = this.slot.filter(function(item){
          if(item.id === id){
            return item;
          }
        });
        if(typeof callback === 'function'){
          return callback(selItem);
        }else{
          return selItem;
        }
      },
      findBySocket : function(sck, callback){
        var _this = this;
        var selItem = this.slot.find(function(item, index){
                        if(item.socket === sck){
                          return {selItem : item , index : index};
                        }
                      });
        if(typeof callback === 'function'){
          return callback(selItem);
        }else{
          return selItem;
        }
      },
      setLiveas : function(id, data, socket, callback){
        var _this = this;
        var selItem = _this.find(id);
        if(selItem.length > 0){
          selItem = selItem[0];
          selItem.liveas.member = data.member;
          selItem.liveas.member_socket = socket;
          selItem.liveas.command = data.command;
          selItem.liveas.params = data.params || null;
          selItem.liveas.oCommand = data.oCommand;
          selItem.liveas.oParams = data.oParams;
          selItem.liveas.timer = parseInt(data.timer) || 20000;
        }

        if(typeof callback === 'function'){
          return callback(selItem);
        }else{
          return selItem;
        }

      },
      unsetLiveas : function(id, callback){
        var _this = this;
        var selItem = _this.find(id);
        if(selItem.length > 0){
          selItem = selItem[0];
          selItem.liveas = {
            member : null,
            member_socket : null,
            command : null,
            params : null,
            oCommand : null,
            oParams : null,
            timer : null
          };

          client_timer.some(function(item, index){
            console.log('TIMER CLEAR!!!!!!!!!!!!!!!!!!!1');
            console.log(item, selItem);
            if(item.id === selItem.id){
              clearTimeout(item.timer);
              client_timer.splice(index,1);
              return;
            }
          });

        }
        if(typeof callback === 'function'){
          return callback(selItem);
        }else{
          return selItem;
        }
      }
    };
    var sckClients = extend({}, socketManager);
    var sckMember = extend({}, socketManager);
    var client_timer = [];

    sckClients.slot = [];
    sckMember.slot = [];

    io.on('connection', function(socket){
      console.log('NEW CONNECTION ', socket.handshake.address);

      /**
       * JOIN EVENT
       */
      socket.on(SOCKETEVENT.MEMBER.JOIN, function(data){
        sckMember.add(data, socket, function(){
          socket.emit(SOCKETEVENT.MEMBER.CLIENTS, {TYPE: 'LIST', CLIENTS : sckClients.slot});
        });
      });

      socket.on(SOCKETEVENT.CLIENT.JOIN, function(data){
        sckClients.add(data, socket, function(item){
          socket.broadcast.emit(SOCKETEVENT.MEMBER.CLIENTS, {TYPE:'JOIN', CLIENTS : sckClients.slot, NEW : item});
        });
      });

      /**
       * LEAVE EVENT
       */
       socket.on(SOCKETEVENT.MEMBER.LEAVE, function(data){
         sckMember.remove(data.id, function(){
           //TODO
         });
       });

       socket.on(SOCKETEVENT.CLIENT.LEAVE, function(data){
         sckClients.remove(data.id, function(){
           socket.broadcast.emit(SOCKETEVENT.MEMBER.CLIENTS, {TYPE:'LEAVE', CLIENTS : sckClients.slot, CLIENT: data.id});
         });
       });

       socket.on(SOCKETEVENT.CLIENT.CANCEL, function(data){
         sckClients.remove(data.id, function(){
           socket.broadcast.emit(SOCKETEVENT.MEMBER.CLIENTS, {TYPE:'CANCEL', CLIENTS : sckClients.slot, CLIENT : data.id});
         });
       });

       /**
        * DISCONNECT EVENT
        */
        socket.on(SOCKETEVENT.DISCONNECT, function(data){
          var item = sckClients.findBySocket(socket.id);
          if(item){
            sckClients.remove(item.id, function(){
              socket.broadcast.emit(SOCKETEVENT.MEMBER.CLIENTS, {TYPE:'LEAVE', CLIENTS : sckClients.slot});
            });
            return;
          }else{
            item = sckMember.findBySocket(socket.id);
            if(item){
              return sckMember.remove(item.id);
            }
          }
        });

      /**
       * LIVE AS EVENT
       */

      socket.on(SOCKETEVENT.MEMBER.CHECKLIVEAS, function(data){
        console.log(SOCKETEVENT.MEMBER.CHECKLIVEAS);
        var item = sckClients.find(data.id);
        console.log(item);
        socket.emit(SOCKETEVENT.MEMBER.CHECKLIVEAS, {liveas : item[0].liveas});
      });
      socket.on(SOCKETEVENT.MEMBER.LIVEAS, function(data){
        console.log(SOCKETEVENT.MEMBER.LIVEAS ,data);
        sckClients.setLiveas(data.id, data.LIVEAS , socket.id, function(item){
          console.log('setliveas ', item);
          if(item){

            var timer = setTimeout(function(){
              socket.emit(SOCKETEVENT.MEMBER.LIVEAS, {TYPE : 'LIVEAS', STEP : 'TIMEOUT', CLIENT : item});
              item.liveas = {
                member : null,
                member_socket : null,
                command : null,
                params : null,
                oCommand : null,
                oParams : null,
                timer : null
              };

            }, item.liveas.timer);

            var timer_item = {
              id : data.id,
              timer : timer
            };

            client_timer.push(timer_item);

            io.to(item.socket).emit(SOCKETEVENT.CLIENT.LIVEAS, item.liveas);
            // socket.emit(SOCKETEVENT.MEMBER.LIVEAS, {TYPE:'LIVEAS', STEP : 'SEND', RESULT : 'SUCCESS'});
          }else{
            // socket.emit(SOCKETEVENT.MEMBER.LIVEAS, {TYPE:'LIVEAS', STEP : 'SEND', RESULT : ''});
          }
        });
      });
      socket.on(SOCKETEVENT.MEMBER.UNLIVEAS, function(data){
          // var member = sckMember.find(data.member);
          sckClients.unsetLiveas(data.CLIENT, function(item){
            console.log('unliveas ', item);
            //if(member) io.to(member.socket).emit(SOCKETEVENT.MEMBER.LIVEAS, {TYPE : 'LIVEAS', STEP : 'RECEIVE', RESULT : data});
          });
      });

      socket.on(SOCKETEVENT.CLIENT.LIVEAS, function(data){
        console.log('CLIENT LIVEAS RESULT SEND :::::::::::::::::::::::::::');
        console.log(data);
        // var member = sckMember.find(data.MEMBER);
        console.log('CLIENT LIVEAS RESULT SEND :::::::::::::::::::::::::::');
        // console.log(member);
        sckClients.find(data.id, function(c){
          var member = sckMember.findBySocket(c[0].liveas.member_socket);
          io.to(member.socket).emit(SOCKETEVENT.MEMBER.LIVEAS, {TYPE : 'LIVEAS', STEP : 'RECEIVE', RESULT : data.RESULT, CLIENT : c[0]});
          sckClients.unsetLiveas(data.id);
        });
      });


      /**
       * REQUEST CLIENT LIST EVENT
       */
      socket.on(SOCKETEVENT.MEMBER.CLIENTS, function(){
        socket.emit(SOCKETEVENT.MEMBER.CLIENTS, {TYPE :'LIST', CLIENTS : sckClients.slot});
      });

      /**
       * CLIENT ALIVE CHECK EVENT
       */
      socket.on(SOCKETEVENT.MEMBER.ALIVE, function(data){
        console.log('CLIENT ALIVE CHECK EVENT');
        var item = sckClients.find(data.id);
        console.log(item);
        socket.emit(SOCKETEVENT.MEMBER.ALIVE, {TYPE : 'ALIVE', STATUS : (item[0] ? 'LIVE' : 'DEAD'), CLIENT : item[0] });
      });

      /**
       * STATUS UPDATE EVENT
       */
      socket.on(SOCKETEVENT.STATUS, function(data){
        console.log(SOCKETEVENT.STATUS);
        sckClients.find(data.id, function(item){
          if(item[0]) io.to(item[0].socket).emit(SOCKETEVENT.STATUS, {TYPE : 'STATUS', STATUS : data.status, item : data.item});
        });
        console.log('MEMBER SEARCH');
        sckMember.slot.forEach(function(item){
          console.log(item);
          if(item.socket != socket.id){
            io.to(item.socket).emit(SOCKETEVENT.STATUS, {TYPE : 'STATUS', STATUS : data.status, item : data});
          }
        });

      });

      /**
       * app version check
       */
      socket.on(SOCKETEVENT.VERSION, function(data){
        var versions, folderpath = 'public/apps/' + data.mobile;
        var path = require('path');
        versions = fs.readdirSync(folderpath).filter(function(file) {
          return fs.statSync(path.join(folderpath, file)).isDirectory();
        });

        versions = versions.sort();        
        socket.emit(SOCKETEVENT.VERSION, {version : versions[versions.length-1]});
      });

    });
})();
