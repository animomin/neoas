(function(){

  var NeoTK = function(){

    var _me = this;

    _me.options = {
      workDate : null,    // 작업일자
      user : neo.user,     // 작업유저
      init : function(){
        var wDate = new Date();
        this.workDate = wDate.GetToday('YYYY-MM-DD');
        this.user = neo.user;
        return;
      }
    };

    _me.listData = {
      data : {},          // as요청, 마이페이지용 데이터
      search : null,    // 검색어
      init : function(){
        this.data = {};
        this.search = "";
        return;
      },
      Load : function(callback){
        /**
         * 1. 센스
         * 2. 메디
         * 3. 이플러스
         */

        /**
         * 1. 센스
         */
        var options = {
          target_list : _me.elem.list.lists[neo.emrs[20].name],
          target_tab : _me.elem.list.tabs[neo.emrs[20].name],
          beforeSend : _beforeSend,
          url : 'clients/list',
          data : {
            type : 'TAKEOVER',
            status : ASSTATUS.TAKEOVER,
            search : this.search || "",
            emr : 20,
            user : _me.options.user.USER_ID,
            user_area : _me.options.user.user_area
          },
          dataType : 'json',
          async : true,
          method : 'GET',
          success : _beforeLoaded,
          callback : _afterLoaded
        };
        neoAJAX.GetAjax(options);

        /**
         * 2. 메디
         */
        options = {
          target_list : _me.elem.list.lists[neo.emrs[8].name],
          target_tab : _me.elem.list.tabs[neo.emrs[8].name],
          beforeSend : _beforeSend,
          url : 'clients/list',
          data : {
            type : 'TAKEOVER',
            status : ASSTATUS.TAKEOVER,
            search : this.search || "",
            emr : 8,
            user : _me.options.user.USER_ID,
            user_area : _me.options.user.user_area
          },
          dataType : 'json',
          async : true,
          method : 'GET',
          success : _beforeLoaded,
          callback : _afterLoaded
        };
        neoAJAX.GetAjax(options);

        /**
         * 3. 이플러스
         */
         options = {
           target_list : _me.elem.list.lists[neo.emrs[1].name],
           target_tab  : _me.elem.list.tabs[neo.emrs[1].name],
           beforeSend : _beforeSend,
           url : 'clients/list',
           data : {
             type : 'TAKEOVER',
             status : ASSTATUS.TAKEOVER,
             search : this.search || "",
             emr : 1,
             user : _me.options.user.USER_ID,
             user_area : _me.options.user.user_area
           },
           dataType : 'json',
           async : true,
           method : 'GET',
           success : _beforeLoaded,
           callback : _afterLoaded
         };
         neoAJAX.GetAjax(options);

        function _beforeSend(opts){
          opts.target_tab.find('span').text('0');
          opts.target_list.empty();
          opts.target_list.append(neoAJAX.GetSpinners('fadingCircles'));
        }

        function _beforeLoaded(opts, data){
          var _this = _me.listData;
          var tabName = opts.target_list.data('name');

          _this.data[tabName] = data.data || [];

          if(data.err && data.err !== 'NODATA'){
            //notify error
            return false;
          }

          if(data.err === 'NODATA'){
            // nodata template call
            _me.elem.list._SetTabCount(opts.target_tab, []);
            _me.elem.list._SetNoItem(opts.target_list);

            return false;
          }

          _this.data[tabName].forEach(function(item, index){
            _me.elem.list._SetNewItem(opts.target_list, item, index, tabName);
          });
          _me.elem.list._SetTabCount(opts.target_tab, _this.data[tabName]);

          return opts.target_list.find('div.spiner-example').removeClass('fadeInDown').addClass('fadeOutUp');
        }

        function _afterLoaded(opts){
          opts.target_list.find('div.spiner-example').remove();
          neoModules.SetElementHeight();
          if(typeof callback === 'function') return callback();
        }

      },
      MoveData : function(sItem, callback){


        if(typeof callback === 'function'){
          return callback();
        }else{
          return false;
        }

      }
    };

    _me.selItem = {
      $elem : null,
      data : null,
      id : null,    // 배열의 인덱스 번호
      index : null,  // 데이터 id
      socket : false,
      init : function(){
        this.$elem = null;
        this.data = null;
        this.id = null;
        this.index = null;
        this.socket = false;
        return;
      },
      /**
       * AS 상태변경
       * 1. 인계확인 : 서비스상태 업데이트 -> 클라이언트 상태변경 메세지 전송, 상태바 리로드(왼쪽 리스트 새로 뿌리기) (data.서비스상태 값변경)
       */
      UpdateAS : function(b){
        var _this = _me.selItem;

        // _this.id = b.data('id');
        // _this.index = b.data('index');
        // _this.$elem = $('div[data-name="'+b.data('name')+'"]').find('.takeover-items[data-id="'+_this.id+'"]');
        // _this.data = _me.listData.data[b.data('name')][_this.id];

        // console.log(_this.data.문의내용);

        var cData = JSON.parse(JSON.stringify(_this.data));
        /* 선택된 AS건의 데이터 갱신 */
        cData.서비스상태 = ASSTATUS.TAKEOVERCONFIRM;
        cData.처리자 = neo.user.USER_NAME;
        cData.처리자ID = neo.user.USER_ID;
        cData.처리자지사 = neo.user.user_area;
        cData.처리자연락처 = neo.user.info_hp || neo.user.info_tel;
        cData.처리일자 = (new Date()).GetToday('YYYY-MM-DD HH:MM:SS');

        /* 변경된 사항 업데이트 */
        neoAJAX.as.UpdateAS(_this.$elem, cData, function(result){
          /* 결과가 성공이면 */
          if(result.err){
            return neoNotify.Show({
              text : 'AS요청건의 상태를 변경하는데 실패하였습니다. \n (ERROR : '+ result.Message+')',
              type : 'error',
              desktop : true
            });
          }

          _me.listData.data[b.data('program')][_this.id] = _this.data = cData;
          /* 소캣으로 클라이언트(상태변경), 다른 직원들에게 메시지 전송 (인계) */
          // $.neoSocket.emitChangeStatus({id : _this.data.인덱스, status : _this.data.서비스상태 });
          $.neoSocket.emitChangeStatus({id : _this.data.인덱스, status : _this.data.서비스상태, item : {
            확인일자 : _this.data.확인일자,
            확인자 : _this.data.확인자,
            확인자연락처 : _this.data.확인자연락처,
            인계일자 : _this.data.인계일자,
            인계자 : _this.data. 인계자,
            인계자연락처 : _this.data.인계자연락처,
            처리일자 : _this.data.처리일자,
            처리자  : _this.data.처리자,
            처리자연락처 : _this.data.처리자연락처
          } });
          // _me.listData.data[b.data('name')].splice(_this.id,1); // 데이터에서 삭제

          _this.$elem.removeClass(_this.$elem.data('animated')).addClass('fadeOutRightBig');
          _this.$elem.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
          function(e){
            _me.elem.list._SetTabCount(_me.elem.list.tabs[b.data('program')],   _me.listData.data[b.data('program')]);
            _this.$elem.remove();
            _this.init();
          });

        });

      }
    };

    /**
     * SET TEMPLATE OR GET ELEMENT
     */
    _me.elem = {
      // $list : null,             // 요청리스트
      list : {
        tabs : {},
        lists : {},
        _SetTabCount : function(obj, data){
          var counter = 0;
          data.forEach(function(item){
            if(item.서비스상태 === ASSTATUS.TAKEOVER){
              counter++;
            }
          });
          return obj.find('span').text(counter);
        },
        _SetNoItem : function(obj){
          return obj.append('<a class="list-group-item takeover-no-item"><h3 class="text-muted font-bold"> 검색된 데이터가 없습니다. </h3></a>');
        },
        _SetNewItem : function(obj, item, index, tabName, $update){
          var $item, isUpdate = false, updateBorder = "";
          if($update){
            isUpdate = true;
            $item = $update;
          }else{
            $item = _me.elem.$item.clone();
          }

          if(obj.find('.takeover-no-item').length){
            obj.find('.takeover-no-item').remove();
          }

          $item.addClass('animated fadeInUp');
          $item.attr({'data-id' : index, 'data-index' : item.인덱스, 'data-animated' : 'fadeInUp', 'data-emergency' : item.응급여부});
          $item.find('button[data-name="인계접수"]').attr({'data-id' : index, 'data-index' : item.인덱스, 'data-program' : tabName})
               .bind('click', _me.events.onUpdateAS);
          $item.find('a[data-name="인계자"]').text(item.인계자);
          $item.find('small[data-name="인계일자"]').text(item.인계일자);
          $item.find('small[data-name="인덱스"]').text(item.인덱스);
          $item.find('h5[data-name="기관명칭"]').text(item.기관명칭 + ' (' + item.기관코드 + ')');
          $item.find('div[data-name="문의내용"]').html(item.문의내용);

          $item.find('td.tb-value[data-id="실행파일"]').text(item.실행파일);
          $item.find('td.tb-value[data-id="실행메뉴"]').text(item.실행메뉴);
          $item.find('td.tb-value[data-id="세부화면"]').text(item.세부화면);

          var question = $item.find('div[data-name="문의내용"]');
          question.find('img.img-preview').bind('click', function(){_me.events.onPopupImage(this);});

          var $updateBadge = $item.find('span[data-name="업데이트"]');
              $updateBadge.empty();
          if(item.응급여부 === 1){
            $updateBadge.append('<span class="badge badge-danger update-badge update-danger ">응급</span>');
            $item.addClass('takeover-items-danger');
          }
          if(!isUpdate){
            var badgename, typename;
            switch (parseInt(item.서비스타입)) {
              case 0:
                badgename = 'badge-done'; typename='선택없음';
                break;
              case 1:
                badgename = 'badge-warning'; typename='장애';
                break;
              case 2:
                badgename = 'badge-primary'; typename='사용법';
                break;
              case 3:
                badgename = 'badge-info'; typename='개선';
                break;
              case 4:
                badgename = 'badge-echart'; typename='기타';
                break;
            }
            $item.find('span.badge[data-name="서비스타입"]')
                .text(typename)
                .addClass(badgename);

            if(item.응급여부 === 1){
              obj.prepend($item);
            }else{
              obj.append($item);
            }
          }else{
            $updateBadge.append('<span class="badge badge-success update-badge update-info">UPDATE</span>');
            if(!$item.hasClass('takeover-items-danger')) $item.addClass('takeover-items-update');
            // var $newOne = $item.clone();
            $item.detach();
            if($('div[data-name="'+tabName+'"] div[data-emergency="1"]:last').length){

              $item.insertAfter($('div.takeover-list[data-name="'+tabName+'"] div.takeover-items[data-emergency="1"]:last'));
            }else{
              // $item.insertAfter($('div.takeover-list[data-name="'+tabName+'"] div[data-emergency="1"]:last'));
              $('div.takeover-list[data-name="'+tabName+'"]').prepend($item);
            }
            // $item.remove();
          }
          return $item;
        }
      },
      $item : null,             // AS요청아이템 템플릿
      $search_i : null,         // 검색어입력박스
      $asStatus : null,         // AS 상태변경 버튼

      init : function(){

        var _this = _me.elem;

        $('.takeover-tab').each(function(index, elem){
          _this.list.tabs[$(elem).data('name')] = $(elem);
        });
        $('.takeover-list').each(function(index, elem){
          _this.list.lists[$(elem).data('name')] = $(elem);
        });

        neoAJAX.GetTemplate('as-takeover-takeover_item' , function(view){
          _this.$item = $(view);
        });

        _this.$search_i = $('input#as_search');


        /**
         * Set Layout
         */
        if(!mobile){
          Split(['#pane-2', '#pane-3', '#pane-4'], {
            gutterSize : 3,
            cursor : 'col-resize'
          });
        }else{
          $('#page-wrapper').addClass('no-padding');
        }

        return this.initEvents();
      },
      initEvents : function(){

        this.$search_i.bind('keyup', _me.events.onSearch);

        return;
      },
      clear : function(callback){


        if(typeof callback === 'function') return callback();
        else return;
      }
    };

    _me.events = {

      /**
       * 검색어 입력 이벤트 Enter 입력시 발생
       */
      onSearch : function(e){
        if(e.type == 'keyup' && (e.keyCode == 13 || e.key == 'Enter')){
          _me.listData.search = $(this).val().trim();
          return _me.listData.Load();
        }
      },


      /**
       * AS확인, 인계접수, 처리완료
       */
      onUpdateAS : function(){
        var _this = $(this);
        console.log(_this.attr('data-id') , _this.attr('data-index'));

        _me.selItem.id = _this.data('id');
        _me.selItem.index = _this.data('index');
        _me.selItem.$elem = $('div.takeover-list[data-name="'+_this.data('program')+'"]').find('.takeover-items[data-id="'+_me.selItem.id+'"]');
        _me.selItem.data = _me.listData.data[_this.data('program')][_me.selItem.id];

        msg = '해당 AS요청건을 인계받으시겠습니까? <br>';
        msg += '인계받은 AS건은 취소가 불가능합니다. <br> (단, [나의AS]에서 다른직원에게 전달은 가능합니다.)';
        msg += "<br> <small class='font-bold text-danger'>서비스상태를 변경하면 접수자의 컴퓨터에도 알림이 나탑니다.</small> <br> 계속하시겠습니까?";
        swal({
          title: 'AS 인계접수',
          //text: msg,
          html : msg,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '네, 변경합니다.'
        }).then(function() {
          _me.selItem.UpdateAS(_this);
          swal({
            title : '인계완료!',
            text : '나의AS 페이지에서 확인할 수 있습니다.',
            type : 'success',
            timer : 2000
          });
        });
      },

      onPopupImage : function(img){
        if(img.modules){
          img = img.modules.editor.restoreTarget();
        }
        var options = {
          button : true,
          fullscreen : false,
          moveable : true,
          rotatable : false,
          scalable : false,
          title : false,
          toolbar : true,
          tooltop : false,
          transition : true,
          zoomable : true,
          navbar : false,
          show : function(){
            $('#page-wrapper').append($('.viewer-container'));
          },
          shown : function(){
            // $('#page-wrapper').append($('.viewer-container'));
          },
          hidden : function(){
            $('.viewer-container').remove();
            viw.destroy();
            viw = null;
          }
        };
        var viw = new Viewer(img, options);
        viw.show();
      },

      /**
       * 현황판에서는 LIST CLIENTS 이벤트에서 딱히 해줄게없다.
       */
      onClients : function(data){
        console.log(data);
      },
      /**
       * 현황판에서 상태값이 변하면 해당아이템을 일단 서버에서 가져오고
       * 지금 뿌려놓은 아이템중에 있는지 체크하고
       * 있으면 업데이트 표시해주고 데이터 새로 뿌리고
       * 없으면 새로 만들어서 추가해준다.
       */
      onChangeStatus : function(data){
        // var isSelected = false;
        console.log(data);
        if(data.TYPE === 'STATUS'){ // 상태가 변한 이벤트가 와야하고
          var itemID = data.item.id;
          // var asData = data.data[0];
          if(_me.selItem.$elem && _me.selItem.$elem.length){
            if(itemID === parseInt(_me.selItem.index)){
              swal.close();
              // isSelected = true;
            }
          }
          // swal.close();
          if(data.STATUS >= ASSTATUS.TAKEOVER){   // 변한 상태가 인계, 인계접수, 완료, 취소 인것만 처리한다.


            // 상태가 인계이면 새로추가 or 업데이트
            if(data.STATUS === ASSTATUS.TAKEOVER){
              var _this = _me.listData;
              var newItem;
              var options = {
                url : 'clients/item',
                data : {id : itemID},
                dataType : 'json',
                async : true,
                method : 'GET',
                success : function(opts, item){

                  if(item.err){
                    return neoNotify.Show({
                      text : '새로운 AS요청건을 불러오는 도중 오류가 발생하였습니다. 새로고침해주세요. \n ' + data.err,
                      type : 'error',
                      desktop : true
                    });
                  }

                  item = item.data[0];
                  var program = neo.emrs[item.프로그램].name;
                  var $elem = $('div[data-name="'+program+'"]').find('.takeover-items[data-index="'+itemID+'"]');
                  if($elem && $elem.length){
                    _me.listData.data[program].some(function(_item,_index){
                      if(_item.인덱스 === item.인덱스){
                        _item = item;
                        itemID = _index;
                        return _item.인덱스 === item.인덱스;
                      }
                    });
                    //itemID가 아닌듯
                    _me.elem.list._SetNewItem(_me.elem.list.lists[program], item, itemID, program, $elem);
                    neoNotify.Show({
                      title : "AS 현황",
                      text : 'AS요청건이 업데이트되었습니다. \n (' + item.기관명칭 + ')',
                      type : 'info',
                      desktop : true
                    });
                  }else{
                    //여기도
                    _me.listData.data[program].push(item);
                    _me.elem.list._SetNewItem(_me.elem.list.lists[program], item, _me.listData.data[program].length-1, program);
                    _me.elem.list._SetTabCount(_me.elem.list.tabs[program], _me.listData.data[program]);
                    neoNotify.Show({
                      title : "AS 현황",
                      text : '새로운 AS요청건이 인계접수 되었습니다. \n (' + item.기관명칭 + ')',
                      type : 'info',
                      desktop : true
                    });
                  }

                  return true;

                }
              };
              neoAJAX.GetAjax(options);
            }else{
              // var program = neo.emrs[asData.프로그램].name;
              var $elem = $('.takeover-items[data-index="'+itemID+'"]');
              if($elem.length){
                $elem.remove();
              }
              // 상태가 인계접수, 완료, 취소 이면 리스트에서 찾아 지워준다.
            }

          }

        }
      }
    };



    _me.Initialize = function(callback){
      _me.options.init();
      _me.listData.init();
      _me.selItem.init();
      _me.elem.init();
      return callback();
    };



    _me.Initialize(function(){
      _me.listData.Load(function(){
        $.neoSocket.module = _me;
      });
    });

  };

  // NeoAS();
  $.neoTK = NeoTK;

})(window);
