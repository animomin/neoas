(function(){

  var NeoAS = function(){

    var _me = this;

    /**
     * 공용 옵션 변수
     */
    _me.options = {
      workDate : null,    // 작업일자
      workState : null,   // 서비스상태,
      workTab : null,
      user : neo.user,     // 작업유저
      area : false,   //지사,전체
      init : function(){
        var wDate = new Date();
        this.workDate = wDate.GetToday('YYYY-MM-DD');
        this.workState = ASSTATUS.ACCEPT;
        this.workTab = 'ACCEPT';
        this.user = neo.user;
        return;
      }
    };
    /**
     * 에디터 설정
     */
    _me.editor = {
      toolbar : [
          ['mybutton', ['capture']],
          ['mybutton2', ['emergency', 'takeover', 'done']],
          ['style', ['bold', 'italic', 'underline', 'clear']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['mybutton3', ['myhelp']]
          // ['picture',['picture']],
      ],
      popover : {
        image: [
            ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
            ['float', ['floatLeft', 'floatRight', 'floatNone']],
            ['view', ['popupImage']],
            ['remove', ['removeMedia']]
        ]
      },
      buttons : {
        capture : function(context){
          var ui = $.summernote.ui;
          var button = ui.button({
            contents : '<i class="fa fa-camera"></i> 캡쳐',
            tooltip : '사용자화면 캡쳐',
            buttonID : 'capture',
            customClass : 'btn-primary as-lives-item',
            customAttr : {
              attrName : 'data-liveas',
              attrValue : '캡쳐'
            }
            // click : function(){_me.events.onCapture();}
          });
          return button.render();
        },
        takeover : function(context){
          var ui = $.summernote.ui;
          var button = ui.button({
            contents : '인계접수',
            tooltip : 'AS요청 인계접수',
            buttonID : 'takeover',
            customClass : 'btn-primary as-status-btn',
            customAttr : {
              attrName : 'data-type',
              attrValue : '2'
            },
            click : function(){}
          });
          return button.render();
        },
        emergency : function(context){
          var ui = $.summernote.ui;
          var button = ui.button({
            contents : '<i class="fa fa-square-o"></i> 응급',
            tooltip : '응급 AS',
            buttonID : 'emergency',
            customClass : 'btn-danger',
            click : function(){_me.events.onEmergency($(this));}
          });
          return button.render();
        },
        done : function(context){
          var ui = $.summernote.ui;
          var button = ui.button({
            contents : '처리완료',
            tooltip : 'AS 처리완료',
            buttonID : 'done',
            customClass : 'btn-primary as-status-btn',
            customAttr : {
              attrName : 'data-type',
              attrValue : '4'
            },
            click : function(){}
          });
          return button.render();
        },
        // new : function(context){
        //   var ui = $.summernote.ui;
        //   var button = ui.button({
        //     contents : '새로작성',
        //     tooltip : '작성화면 초기화',
        //     buttonID : 'new',
        //     customClass : 'btn-primary',
        //     click : function(){_me.events.onNew(context);}
        //   });
        //   return button.render();
        // },
        popupImage : function(context){
          var ui = $.summernote.ui;
          var button = ui.button({
            contents : '<i class="fa fa-image"></i>',
            tooltip: '크게보기',
            buttonID : 'popupImage',
            click : function(){_me.events.onPopupImage(context);}
          });
          return button.render();
        },
        myhelp : function(context){
          var ui = $.summernote.ui;
          var button = ui.button({
            contents : '<i class="fa fa-question"></i>',
            tooltip: '도움말',
            buttonID : 'myhelp',
            click : function(){_me.events.onHelp(context);}
          });
          return button.render();
        }
      }
    };
    /**
     * AS 접수리스트
     */
    _me.listData = {
      data : {},          // as요청, 마이페이지용 데이터
      search : null,    // 검색어
      init : function(){
        this.data = {};
        this.search = "";
        return;
      },
      Load : function(type,callback){
        /**
         * 1. 오늘자 접수리스트 로드
         * 2. 전체날짜 진행중인거 로드
         * 3. 전체날짜 취소된거 로드
         */
         var onLoaded_Join = false;
         var onLoaded_Work = false;
         var onLoaded_Cancel = false;

        /**
         * 1. 오늘자 접수리스트 로드
         */
          var options = {
            type : 'JOIN',
            target_list : _me.elem.list.$accept,
            target_tab : _me.elem.list.$acceptTab,
            beforeSend : _beforeSend,
            url : 'clients/list',
            data : {
              date : _me.options.workDate,
              // status : _me.options.workState,
              status : _me.elem.list.$acceptTab.data('type'),
              search : this.search || "",
              user : _me.options.user.USER_ID,
              user_area : _me.options.user.user_area,
              area : _me.options.area
            },
            dataType : 'json',
            async : true,
            method : 'GET',
            success : _beforeLoaded,
            callback : _afterLoaded
          };
        if(type === null || type === 'JOIN'){
          neoAJAX.GetAjax(options);
        }
        /**
         * 2. 전체날짜 진행중인거 로드
         */
        options = {
          type : null,
          target_list : _me.elem.list.$working,
          target_tab : _me.elem.list.$workingTab,
          beforeSend : _beforeSend,
          url : 'clients/list',
          data : {
            status : _me.elem.list.$workingTab.data('type'),
            search : this.search || '',
            user : _me.options.user.USER_ID,
            user_area : _me.options.user.user_area,
            area : _me.options.area
          },
          dataType : 'json',
          async : true,
          method : 'GET',
          success : _beforeLoaded,
          callback : _afterLoaded
        };
        if(type === null){
          neoAJAX.GetAjax(options);
        }
        /**
         * 3. 전체날짜 취소된거 로드
         */
         options = {
           type : 'CANCEL',
           target_list : _me.elem.list.$cancel,
           target_tab : _me.elem.list.$cancelTab,
           beforeSend : _beforeSend,
           url : 'clients/list',
           data : {
             status : _me.elem.list.$cancelTab.data('type'),
             search : this.search || '',
             user : _me.options.user.USER_ID,
             user_area : _me.options.user.user_area,
             area : _me.options.area
           },
           dataType : 'json',
           async : true,
           method : 'GET',
           success : _beforeLoaded,
           callback : _afterLoaded
         };
         if(type === null || type === 'CANCEL'){
           neoAJAX.GetAjax(options);
         }

        function _beforeSend(opts){
          opts.target_tab.find('span').text('0');
          opts.target_list.empty();
          opts.target_list.append(neoAJAX.GetSpinners('fadingCircles'));
        }

        function _beforeLoaded(opts, data){
          // console.log(data);
          var _this = _me.listData;
          var tabName = opts.target_list.data('name');
          var counter = 0;

          _this.data[tabName] = data.data;
          console.log(_this.data);

          if(data.err && data.err !== 'NODATA'){
            //notify error
            return false;
          }

          if(data.err === 'NODATA'){
            // nodata template call
            _me.elem.list._SetTabCount(opts.target_tab, counter);
            _me.elem.list._SetNoItem(opts.target_list);

            return false;
          }

          _this.data[tabName].forEach(function(item, index){
            counter++;
            var newItem = _me.elem.list._SetNewItem(opts.target_list, item, index);
                newItem.bind('click', _me.events.onAccepItemClick);
          });
          _me.elem.list._SetTabCount(opts.target_tab, counter);



          return opts.target_list.find('div.spiner-example').removeClass('fadeInDown').addClass('fadeOutUp');
        }

        function _afterLoaded(opts){
          var _this = _me.listData;
          opts.target_list.find('div.spiner-example').remove();
          neoModules.SetElementHeight();

          if(opts.type === 'JOIN') onLoaded_Join = true;
          if(opts.type === null) onLoaded_Work = true;
          if(opts.type === 'CANCEL') onLoaded_Cancel = true;

          if(typeof callback === 'function'){

            if(!type){
              if(onLoaded_Join && onLoaded_Work && onLoaded_Cancel) return callback();
            }else{
              if(type === 'JOIN'){
                if(onLoaded_Join) return callback();
              }
              if(type === 'CANCEL'){
                if(onLoaded_Cancel) return callback();
              }
            }
          }

          // if(type === 'JOIN'){
          //   if(opts.type === 'JOIN'){
          //     callback();
          //   }
          // }else{
          //   if(opts.type === 'CANCEL'){
          //     callback();
          //   }
          // }
        }

        // if(typeof callback === 'function') return callback();

      },
      FindDataByIndex : function(index){  // 배열의 인덱스로 찾기

      },//FindDataByIndex
      FindDataByID : function(id){  // 배열의 데이터의 인덱스값으로 찾기 (필드이름이 인덱스임)
        var _this = _me.listData;
        var selItem = null;
        $.each(_this.data, function(index, arr){
          console.log(index, arr);
          if(arr && arr.length){
            selItem = arr.find(function(item){
              return parseInt(item.인덱스) === parseInt(id);
            });
          }

          if(selItem) return false;
        });
        return selItem;
      },
      FindDataInfoByID : function(id){
        var _this = _me.listData;
        var selItem = null;
        var selItemInfo = {};
        $.each(_this.data, function(index, arr){
          if(arr && arr.length){
            selItem = arr.find(function(item,rindex){
              if(parseInt(item.인덱스) === parseInt(id)){
                selItemInfo.index = rindex;
                selItemInfo.tabName = index;
                return item;
              }
            });
          }
          if(selItem) return false;
        });
        return selItemInfo;
      }
    };
    /**
     * 선택한 AS 정보
     */
    _me.selItem = {
      $elem : null,
      data : null,
      id : null,    // 배열의 인덱스 번호
      index : null, // 데이터의 id값
      socket : false,
      imgStack : {},
      init : function(){
        this.$elem = null;
        this.data = null;
        this.id = null;
        this.index = null;
        this.socket = false;
        return;
      },
      Load : function(elem){
        console.log('as item selected');

        var _this = _me.selItem;

        if(_this.$elem && _this.id != elem.data('id')){
          _this.data.문의내용 = _me.elem.GetComment();
        }

        _this.$elem = elem;
        _this.id = _this.$elem.data('id');
        _this.index = _this.$elem.data('index');
        _this.data = _me.listData.data[_me.options.workTab][_this.id];


        _me.elem.clear(function(){

          /**
           * AS 상태바 로드
           */
          var serviceName = ASSTATUS.ServiceName(_this.data.서비스상태);
          var progBarCon = $('#hosp-status').empty();
          var progBar = _this.$elem.find('.progress-mini').clone();
          progBar.removeClass('progress-mini').addClass('progress-striped active');
          if(_this.data.서비스상태 === ASSTATUS.DONE){
            progBar.find('.progress-bar-success').text(serviceName);
            _me.elem.$asStatus.addClass('disabled');
          }else{
            //$('#as-confirm').addClass(_this.data.서비스상태 === ASSTATUS.ACCEPT ? '' : 'disabled');
            _me.elem.$asStatus.removeClass('disabled');
            var asConfirm = _me.elem.$asStatus.filter(function(){return $(this).data('type') == 1;});

                if(_this.data.서비스상태 === ASSTATUS.ACCEPT) asConfirm.removeClass('disabled');
                else asConfirm.addClass('disabled');

            progBar.find('.progress-bar-danger').text(serviceName);
          }

          progBarCon.append(progBar);

          /**
           * 응급여부 표시!
           */
           var Emergency = $('button#emergency').find('i');
           if(_this.data.응급여부 == 1){
             Emergency.removeClass('fa-square-o').addClass('fa-check-square-o');
           }else{
             Emergency.removeClass('fa-check-square-o').addClass('fa-square-o');
           }

          /**
           * AS요청정보 & 병원정보 로드
           */
          _me.elem.$tblhosp.each(function(i, v){
            var dataID = $(v).data('id');
            var value = _this.data[dataID];
            switch (dataID) {
              case '프로그램':
                value = neo.emrs[value].name;
                break;
              case '지사코드':
                value = neo.area[value];
                break;
              case '취소사유':
                return $(v).html(value);
              case '접수연락처':
                if(value.indexOf(':') >= 0){
                  if(value.split(':')[1] !== ''){
                    value = '<a href="tel:' + value.split(':')[0] + '">' + value.split(':')[0] + '</a> (내선: ' + value.split(':')[1] + ') ';
                  }else{
                    value = '<a href="tel:' + value.split(':')[0] + '">' + value.split(':')[0] + '</a>';
                  }
                }else{
                  value = '<a href="tel:' + value.split(':')[0] + '">' + value.split(':')[0] + '</a>';
                }
                return $(v).html(value);
              default:
                value = value;
            }
            $(v).text(value);
          });

          /**
           * AS문의내용 & 확인내용
           */
          _me.elem.SetTemplate();

          /**
           * 소켓 연결 체크
           */
          $.neoSocket.emitClientAlive({id : _this.data.인덱스}, function(res){
            if(res.TYPE === 'ALIVE'){
              var wifi = $(_this.$elem.find('span[data-name="연결상태"]'));
              _this.socket = res.STATUS === 'LIVE';
              if(_this.socket){
                  wifi.addClass('badge-info');
                  _me.elem.$liveas.removeClass('disabled');
              }else{
                  wifi.removeClass('badge-info');
                  _me.elem.$liveas.addClass('disabled');
              }

            }
          });

          var lys = null;
          _me.elem.$lyExe.empty();
          _me.elem.$lyMenu.empty();
          _me.elem.$lyDetail.empty();

          lys = neo.emrs[_this.data.프로그램].layouts;
          var exes = Object.keys(lys);
          exes.forEach(function(item){
            var newItem = $('<option />').text(item);
            _me.elem.$lyExe.append(newItem);
          });
          _me.elem.$lyExe.selectpicker({
            size : 10
          }).selectpicker('refresh').selectpicker('val', _this.data.실행파일).trigger('changed.bs.select');



          if(mobile){
            $('#page1').fadeOut('fast', function(){
              $('#page2').removeClass('hidden');
              $('#page2').fadeIn('fast');
            });
          }

        });
      },
      /**
       * AS 상태변경
       * 1. 확인 : 서비스상태 업데이트 -> 클라이언트 상태변경 메세지 전송, 상태바 리로드(왼쪽 리스트 새로 뿌리기) (data.서비스상태 값변경)
       * 2. 인계접수 : 서비스상태 업데이트 -> 클라이언트 상태변경 메세지 전송, 문의내용 업데이트 + (data.문의내용 값변경) , 상태바 리로드(왼쪽 리스트 새로 뿌리기)
       * 3. 완료 : 서비스상태 업데이트 -> 클라이언트 상태변경 메세지 전송, 문의내용 업데이트 + (data.문의내용 값변경) , 상태바 리로드(왼쪽 리스트 새로 뿌리기)
       */
      UpdateAS : function(status){
        var _this = _me.selItem;
        var tab = _me.elem.list.$workingTab;
        var cData = JSON.parse(JSON.stringify(_this.data));
        /* 선택된 AS건의 데이터 갱신 */
        cData.서비스상태 = parseInt(cData.서비스상태) !== ASSTATUS.TAKEOVERCONFIRM ? status : cData.서비스상태;
        cData.문의내용 = _me.elem.GetComment();
        cData.실행메뉴 = _me.elem.$lyMenu.selectpicker('val');
        cData.세부화면 = _me.elem.$lyDetail.selectpicker('val');
        switch (status) {
          case ASSTATUS.CONFIRM:
            cData.확인자 = neo.user.USER_NAME;
            cData.확인자ID = neo.user.USER_ID;
            cData.확인자지사 = neo.user.user_area;
            cData.확인자연락처 = neo.user.info_hp || neo.user.info_tel;
            cData.확인일자 = (new Date()).GetToday('YYYY-MM-DD HH:MM:SS');
            break;
          case ASSTATUS.TAKEOVER:
            if(cData.확인자ID === 0){
              cData.확인자 = neo.user.USER_NAME;
              cData.확인자ID = neo.user.USER_ID;
              cData.확인자지사 = neo.user.user_area;
              cData.확인자연락처 = neo.user.info_hp || neo.user.info_tel;
              cData.확인일자 = (new Date()).GetToday('YYYY-MM-DD HH:MM:SS');
            }
            cData.인계자 = neo.user.USER_NAME;
            cData.인계자ID = neo.user.USER_ID;
            cData.인계자지사 = neo.user.user_area;
            cData.인계자연락처 = neo.user.info_hp || neo.user.info_tel;
            cData.인계일자 = (new Date()).GetToday('YYYY-MM-DD HH:MM:SS');
            // cData.문의내용 = $('span#question').html(); //_me.elem.GetComment();//_me.elem.$edit_q.summernote('code');
            break;
          case ASSTATUS.DONE:
            if(cData.확인자ID === 0){
              cData.확인자 = neo.user.USER_NAME;
              cData.확인자ID = neo.user.USER_ID;
              cData.확인자지사 = neo.user.user_area;
              cData.확인자연락처 = neo.user.info_hp || neo.user.info_tel;
              cData.확인일자 = (new Date()).GetToday('YYYY-MM-DD HH:MM:SS');
            }
            cData.처리자 = neo.user.USER_NAME;
            cData.처리자ID = neo.user.USER_ID;
            cData.처리자지사 = neo.user.user_area;
            cData.처리자연락처 = neo.user.info_hp || neo.user.info_tel;
            cData.처리일자 = (new Date()).GetToday('YYYY-MM-DD HH:MM:SS');
            // cData.문의내용 = _me.elem.$edit_q.summernote('code');

            break;
        }

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
          _me.listData.data[_me.options.workTab][_this.id] = _this.data = cData;
          /* 소캣으로 클라이언트(상태변경), 다른 직원들에게 메시지 전송 (인계) */
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

          /* listData에서 해당데이터를 이동시킨다 */
          // _me.listData.MoveData(_this.data, function(){
          //   _this.$elem.attr('data-id', _this.id);
          //   _me.elem.RefreshElem(_this.$elem, _this.data);
          //   _me.elem.RefreshTabCount();
          // });
          tab.tab('show');
          _me.options.workTab = tab.data('name');

          _me.listData.Load(null, function(){
            $.neoSocket.emitClients();

            if(status === ASSTATUS.DONE){
              _me.elem.clear();
              _me.selItem.init();
            }else{
              if(_me.selItem.$elem.length){
                var prevElem = $('a.as-item[data-index="'+_me.selItem.data.인덱스+'"]');
                if(prevElem.length){
                  _me.options.workTab = prevElem.parent().data('name');
                  prevElem.trigger('click');
                }else{
                  _me.elem.clear();
                  _me.selItem.init();
                }
              }
            }

          });
        });

      },
      onLive : function(onoff, command, id){
        var _this = _me.selItem;
        var $Icon;
        if(onoff){
          $Icon = _this.$elem.find('span[data-name="라이브"]');
          $Icon.attr('data-index', _this.data.인덱스);
          $Icon.append('<span class="btn btn-warning btn-xs animated slideInRight pull-right"><i class="fa fa-spinner fa-spin"></i> ' + command + '</span>');
        }else{
          $Icon = $('span.ico-liveas[data-index="'+id+'"]');
          $Icon.find('span').removeClass('slideInLeft').addClass('slideOutRight');
          $Icon.find('span').one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
          function(e) {
            $Icon.find('span').remove();
          });
        }
      }
    };

    _me.library = {
      $list : null,
      $item : null,
      search : null,
      init : function(){
        var _this = this;
        _this.search = "";
        _this.$list = _me.elem.$library || $('div#library');
        neoAJAX.GetTemplate('as-takeover-takeover_item' , function(view){
          _this.$item = $(view);
        });
        return;
      },
      Load : function(){
        var _this = _me.library;

        if(_this.search + "" === ""){
          var $input = _me.elem.$search_library || $('input#search_library');
          $input.addClass('animated tada').popover({
            content: "<span class='font-bold text-danger'>검색어를 입력해주세요.</span>",
            placement: "bottom",
            html : true,
          }).popover('show').on('shown.bs.popover',function(){
            setTimeout(function(){
              $input.removeClass('animated tada').popover('hide');
            }, 2000);
          });

          return false;
        }

        var options = {
          target_list : _this.$list,
          beforeSend : _beforeSend,
          url : 'clients/list',
          data : {
            type : 'HISTORY',
            search : _this.search
          },
          dataType : 'json',
          async : true,
          method : 'GET',
          success : _beforeLoaded,
          callback : _afterLoaded
        };
        neoAJAX.GetAjax(options);

        function _beforeSend(opts){
          opts.target_list.empty();
          opts.target_list.append(neoAJAX.GetSpinners('fadingCircles'));
        }

        function _beforeLoaded(opts, data){
          // console.log(data);
          if(data.err && data.err !== 'NODATA'){
            neoNotify.Show({
              title : 'AS 기록 검색',
              text : data.err.message
            });
            return false;
          }

          if(data.err === 'NODATA'){
            neoNotify.Show({
              title : 'AS 기록 검색',
              text : '검색결과가 없습니다.'
            });
            return false;
          }

          data.data.forEach(function(item, index){
            var newItem = _this._SetNewItem(opts.target_list, item, index);
          });
          return opts.target_list.find('div.spiner-example').removeClass('fadeInDown').addClass('fadeOutUp');
        }

        function _afterLoaded(opts){
          opts.target_list.find('div.spiner-example').remove();
        }
      },
      _SetNewItem : function(obj, item, index){
        var _this = _me.library;
        var $item = _this.$item.clone();

        $item.addClass('animated fadeInUp');
        $item.attr({'data-id' : index, 'data-index' : item.인덱스, 'data-animated' : 'fadeInUp', 'data-emergency' : item.응급여부});
        $item.find('button[data-name="인계접수"]').remove();
        $item.find('a[data-name="인계자"]').text(item.인계자);
        $item.find('small[data-name="인계일자"]').text(item.인계일자);
        $item.find('h5[data-name="기관명칭"]').text(item.기관명칭 + ' (' + item.기관코드 + ')');
        $item.find('div[data-name="문의내용"]').html(item.문의내용);

        $item.find('td[data-id="실행파일"]').text(item.실행파일);
        $item.find('td[data-id="실행메뉴"]').text(item.실행메뉴);
        $item.find('td[data-id="세부화면"]').text(item.세부화면);

        var $updateBadge = $item.find('span[data-name="업데이트"]');
            $updateBadge.empty();
        if(item.응급여부 === 1){
          $updateBadge.append('<span class="badge badge-danger update-badge update-danger ">응급</span>');
          $item.addClass('takeover-items-danger');
        }

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

        obj.append($item);
        return $item;
      }
    };
    /**
     * SET TEMPLATE OR GET ELEMENT
     */
    _me.elem = {
      // $list : null,             // 요청리스트
      list : {
        $acceptTab : null,
        $workingTab : null,
        $cancelTab : null,
        $accept : null,
        $working : null,
        $cancel : null,
        _SetTabCount : function(obj, count){
          if(obj && count){
            return obj.find('span').text(count);
          }else{
            obj = _me.listData.data[this.$acceptTab.data('name')];
            count = 0;
            if(obj && obj.length){
              obj.forEach(function(item){
                if(item){
                  count += 1;
                }
              });
            }
            this.$acceptTab.find('span').text(count);

            obj = _me.listData.data[this.$workingTab.data('name')];
            count = 0;
            if(obj && obj.length){
              obj.forEach(function(item){
                if(item){
                  count += 1;
                }
              });
            }
            this.$workingTab.find('span').text(count);

            obj = _me.listData.data[this.$cancelTab.data('name')];
            count = 0;
            if(obj && obj.length){
              obj.forEach(function(item){
                if(item){
                  count += 1;
                }
              });
            }
            this.$cancelTab.find('span').text(count);

            return;
          }
        },
        _SetNoItem : function(obj){
          return obj.append('<a class="list-group-item"><h3 class="text-muted font-bold"> 검색된 데이터가 없습니다. </h3></a>');
        },
        _SetNewItem : function(obj, item, index, first){
          var $item = _me.elem.$item.clone();

          $item.addClass('animated fadeIn');
          $item.attr({'data-id' : index, 'data-index' : item.인덱스, 'data-animated' : 'fadeIn'});
          $item.find('span[data-name="접수일자"]').text(item.접수일자);
          $item.find('span[data-name="인덱스"]').text(item.인덱스);

          //progress-bar
          item.서비스상태 = parseInt(item.서비스상태);
          if(item.서비스상태 === ASSTATUS.DONE){
            $item.find('div.progress-bar-success').css('width' , '100%');
            $item.find('div.progress-bar-danger').addClass('hidden');
          }else if(item.서비스상태 === ASSTATUS.CANCEL){
            $item.find('div.progress-bar-success').addClass('hidden');
            $item.find('div.progress-bar-danger').css('width' , '100%');
          }else{
            $item.find('div.progress-bar-success').css('width' , (item.서비스상태 * 20) + '%');
            $item.find('div.progress-bar-danger').css('width' , '20%');
          }

          $item.find('strong[data-name="기관명칭"]').text(item.기관명칭 + ' (' + item.기관코드 + ')');
          $item.find('span.badge[data-name="프로그램"]')
               .text(neo.emrs[item.프로그램] ? neo.emrs[item.프로그램].name : "정보없음")
               .addClass(neo.emrs[item.프로그램] ? neo.emrs[item.프로그램].badge : "");
          if(item.응급여부 == 1){
            $item.find('span.badge[data-name="응급여부"]').removeClass('hidden');
          }
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

          if(first){
            obj.prepend($item);
          }else{
            obj.append($item);
          }
          return $item;
        }
      },
      $item : null,             // 요청아이템
      $search_i : null,         // 검색어입력박스
      $search_area : null,      // 전체 체크 버튼
      $tblhosp : null,          // 병원정보테이블
      $custom : null,           // 사용자정의
      $library : null,          // 문의내용 검색
      $search_library : null,   // 기록검색입력박스
      $liveas : null,           // 실시간 AS 명령 버튼 + 캡쳐버튼
      $asStatus : null,         // AS 상태변경 버튼
      $edit_q : null,           // 문의내용 에디터
      // $edit_c : null,           // 확인내용 에디터
      // $edit_d : null,            // 처리내용 에디터,
      $lyExe : null,              // 실행파일 멀티박스
      $lyMenu : null,             // 실행메뉴 멀티박스
      $lyDetail : null,           // 세부화면 멀티박스
      $status : null,            // 상태바
      init : function(){

        var _this = _me.elem;
        // _this.$list = $('div.as_list');
        _this.list.$acceptTab = $('a.aceept-tab[data-type="0"]');
        _this.list.$workingTab = $('a.aceept-tab[data-type="1,2,3"]');
        _this.list.$cancelTab = $('a.aceept-tab[data-type="5"]');


        _this.list.$accept = $('.accept-list[data-type="0"]');
        _this.list.$working = $('.accept-list[data-type="1,2,3"]');
        _this.list.$cancel = $('.accept-list[data-type="5"]');
        neoAJAX.GetTemplate('as-request-accept_item' , function(view){
          _this.$item = $(view);
        });

        _this.$search_i = $('input#as_search');
        _this.$search_area = $('button#as_search_area');
        _this.$tblhosp = $('table tr td.tb-value');
        // _this.$custom = $('di')    // 사용자정의
        _this.$library = $('div#library');       // 문의내용 검색
        _this.$search_library = $('input#search_library');
        _this.$status = $('div.as_status');

        _this.$lyExe = $('#as-toolbar-execute');
        _this.$lyMenu = $('#as-toolbar-menu');
        _this.$lyDetail = $('#as-toolbar-detail');
        _this.$lyExe.selectpicker({size : 10});
        _this.$lyMenu.selectpicker({size : 10});
        _this.$lyDetail.selectpicker({size : 10});
        $('#as-toolbar-edit').removeClass('hidden');

        _this.$edit_q = $('#as_question');
        $(_this.$edit_q).summernote({
          toolbar  : _me.editor.toolbar,
          popover : _me.editor.popover,
          lang : 'ko-KR',
          height: 500,
          buttons : _me.editor.buttons
        });

        if(mobile){
          $('.note-btn').attr({
            'title': ''  ,
            'data-original-title' : ''
          });
        }

        this.SetTemplate(this.$edit_q);

        _this.$liveas = $('.as-lives-item');

        _this.$asStatus = $('.as-status-btn');


        /**
         * Set Layout
         */
        if(!mobile){
          Split(['#left','#right'], {
            gutterSize : 3,
            cursor: 'col-resize',
            sizes : [20,80]
          });
          Split(['#right-col1', '#right-col2'], {
            gutterSize : 3,
            direction : 'vertical',
            sizes: [30,70],
            cursor : 'row-resize'
          });

          Split(['#pane-1', '#pane-2', '#pane-3'], {
            gutterSize : 3,
            cursor : 'col-resize'
          });
          Split(['#pane-4', '#pane-5'], {
            gutterSize : 3,
            cursor : 'col-resize',
            sizes : [40,60]
          });
        }else{
          $('#page-wrapper').addClass('no-padding');
          $('#accept_search').removeClass('panel-heading');
          $('#accept_search').find('.form-group').addClass('m-b-xs m-t-xs');
        }

        return this.initEvents();
      },
      initEvents : function(){

        $('a.aceept-tab').bind('click', _me.events.onAcceptTabClick);
        this.$search_i.bind('keyup', _me.events.onSearch);
        this.$search_area.bind('click', _me.events.onAreaAllClick);
        this.$liveas.bind('click', _me.events.onExecuteLiveAS);
        this.$asStatus.bind('click', _me.events.onUpdateAS);
        this.$search_library.bind('keyup', _me.events.onLibrarySearch);
        $('.selectpicker').on('changed.bs.select', _me.events.onExeDetailClick);
        if(mobile){
          $('a.as-tab[data-tab="list"]').bind('click', function(e){
            e.preventDefault();
            $('#page2').fadeOut('fast', function(){
              $('#page1').fadeIn('fast');
            });
          });
        }
        return;
      },
      clear : function(callback){
        /**
         * 요청정보 & 병원정보 클리어
         */
        this.$tblhosp.each(function(index,item){
          $(item).text('');
        });

        /**
         * 문의내용 & 확인내용 클리어
         */
        this.$edit_q.summernote('code', '');
        // this.SetTemplate(this.$edit_q);

        this.$liveas.each(function(i,v){

          if($(v).data('liveas') === _me.Live.LIVECOMMANDS.CAPTURE){
            var capIcon =  $(v).find('i');
            if($(capIcon).hasClass('fa-spinner')){
              $(capIcon).removeClass('fa-spinner fa-spin');
            }

            if(!$(capIcon).hasClass('fa-camera')){
              $(capIcon).addClass('fa-camera');
            }

          }else{
            $(v).find('i.fa-spinner').remove();
          }
        });

        this.$lyExe.empty();
        this.$lyExe.selectpicker('refresh');
        this.$lyMenu.empty();
        this.$lyMenu.selectpicker('refresh');
        this.$lyDetail.empty();
        this.$lyDetail.selectpicker('refresh');

        if(typeof callback === 'function') return callback();
        else return;
      },
      FindElemByID : function(id){
        return $('.as-item[data-index="'+id+'"]');
      },//FindElemByIdD
      SetTemplate : function(force, callback){
        var Tmplt = "", TmpltTable = "";
        var target = this.$edit_q;
        var item = _me.selItem.data;

        Tmplt = '<span id="template"><h3>1. 문의내용 ( 병원용 )</h3><span id="question"><p><br></p></span><h3>2. 확인내용 ( 담당자용 )</h3><p><br></p><h3>3. 처리내용 </h3><p><br></p></p></span>';
        TmpltTable ='<table id="personInfo" class="table table-bordered small"><tbody><tr><td>접수자 정보<br></td><td>확인자 정보<br></td><td>인계자 정보<br></td><td>처리자 정보<br></td></tr><tr><td><span id="iaccept"></span><br></td><td><span id="iconfirm"></span><br></td><td><span id="itakeover"></span><br></td><td><span id="idone"></span><br></td></tr></tbody></table>';

        if(item){

          var question = item.문의내용.trim();
          if(question.indexOf('<span id="template">') >= 0){
            target.summernote('code', question + TmpltTable);
          }else{
            target.summernote('code', Tmplt + TmpltTable);
            $('span#question').html(item.문의내용.trim());
          }

          // $('span#confirm').html(item.확인내용.trim());
          // $('span#done').html(item.처리내용.trim());
          if( _me.selItem.imgStack[item.인덱스]){
            if($('span#question').length){
              $('span#question').prepend(_me.selItem.imgStack[item.인덱스].img);
            }else{
              $('.note-editable').prepend(_me.selItem.imgStack[item.인덱스].img);
            }
            delete  _me.selItem.imgStack[item.인덱스];
          }

          $('.note-editable').find('span#iaccept').html(
            '접수자 : ' + item.접수자.trim() + '<br>' +
            '접수자 연락처 : ' + item.접수연락처.trim()
          );

          $('.note-editable').find('span#iconfirm').html(
            '확인자 : ' + item.확인자.trim() + '<br>' +
            '확인자 연락처 : ' + item.확인자연락처.trim() + '<br>' +
            '확인일자 : ' + (item.확인자ID === 0 ?  "" : item.확인일자.trim())
          );


          $('.note-editable').find('span#itakeover').html(
            '인계자 : ' + item.인계자.trim() + '<br>' +
            '인계자 연락처 : ' + item.인계자연락처.trim() + '<br>' +
            '인계일자 : ' + (item.인계자ID === 0 ?  "" : item.인계일자.trim())
          );


          $('.note-editable').find('span#idone').html(
            '처리자 : ' + item.처리자.trim() + '<br>' +
            '처리자 연락처 : ' + item.처리자연락처.trim() + '<br>' +
            '처리일자 : ' + (item.처리자ID === 0 ?  "" : item.처리일자.trim())
          );


          //item.문의내용 = $('span#question').html();

        }else{
          target.summernote('code', Tmplt + TmpltTable);
          // target.summernote('insertNode', $(TmpltTable));
        }



        if(typeof callback === 'function'){
          return callback();
        }else{
          return;
        }
      },
      GetComment : function(){
        $('table#personInfo').remove();
        return _me.elem.$edit_q.summernote('code');
      }
    };

    /**
     * 이벤트 모음
     */
    _me.events = {
      /**
       * 지사전체 검색 버튼 클릭
       */
      onAreaAllClick : function(e){
        $(this).toggleClass('active');
        _me.options.area = $(this).hasClass('active');
        if(_me.options.area){
          $(this).prepend('<i class="fa fa-check"><i>');
        }else{
          $(this).find('i').remove();
        }
        return _me.listData.Load(null,function(){
          $.neoSocket.emitClients();
        });
      },
      /**
       * 검색어 입력 이벤트 Enter 입력시 발생
       */
      onSearch : function(e){
        if(e.type == 'keyup' && (e.keyCode == 13 || e.key == 'Enter')){
          _me.listData.search = $(this).val().trim();
          return _me.listData.Load(null);
        }
      },
      /**
       * AS 기록 검색
       */
      onLibrarySearch : function(e){
        if(e.type == 'keyup' && (e.keyCode == 13 || e.key == 'Enter')){
          _me.library.search = $(this).val().trim();
          return _me.library.Load();
        }
      },
      /**
       * 접수, 진행중, 취소 리스트 아이템 클릭이벤트
       */
      onAccepItemClick : function(e){
        e.preventDefault();

        $(this).addClass('active').siblings().removeClass('active');

        return _me.selItem.Load($(this));
      },
      /**
       * 접수, 진행중, 취소 탭 선택 이벤트
       */
      onAcceptTabClick : function(e){
        _me.options.workTab = $(this).data('name');
        $.neoSocket.emitClients();
      },


      /**
       * AS확인, 인계접수, 처리완료
       */
      onUpdateAS : function(){
        var type = parseInt($(this).data('type'));
        var msg;

        if($(this).hasClass('disabled')) return false;

        if(_me.selItem.data.서비스상태 === ASSTATUS.TAKEOVERCONFIRM && type === ASSTATUS.DONE){
          return neoNotify.Show({
            title : "NeoSoftBank A/S",
            text : '해당 A/S 요청건은 처리담당자만 완료처리가 가능합니다.',
            desktop : false
          });
        }

        //alert($(this).data('type'));

        switch (type) {
          case ASSTATUS.CONFIRM:
            msg = "해당 AS요청건을 확인처리합니다.";
            break;
          case ASSTATUS.TAKEOVER:
            msg = "해당 AS요청건을 인계접수합니다. <br> 이미 인계접수된 AS는 문의내용이 수정됩니다.";
            break;
          case ASSTATUS.DONE:
            msg = "해당 AS요청건을 완료처리합니다";
            break;
          default:
        }
        msg += "<br><small class='font-bold text-danger'> 서비스상태를 변경하면 접수자의 컴퓨터에도 알림이 나탑니다. </small> <br> 계속하시겠습니까?";
        swal({
          title: 'AS 상태 변경',
          //text: msg,
          html : msg,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '네, 변경합니다.'
        }).then(function() {
          _me.selItem.UpdateAS(type);
          swal({
            title : '변경완료!',
            text : 'AS상태가 변경되었습니다.',
            type : 'success',
            timer : 2000
          });
        });

      },

      /**
       * 응급여부 체크
       */
      onEmergency : function(b){
        _me.selItem.data.응급여부 = _me.selItem.data.응급여부 === 0 ? 1 : 0;
        if(_me.selItem.data.응급여부 === 1){
          b.find('i').removeClass('fa-square-o').addClass('fa-check-square-o');
        }else{
          b.find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
        }
      },
      /**
       * 새로작성
       */
      // onNew : function(){
      //   _me.elem.SetTemplate();
      // },
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
       * LIVE AS 클릭 이벤트
       */
      onExecuteLiveAS : function(e){
        e.preventDefault();
        if(!_me.selItem.$elem){
          neoNotify.Show({
            text : '리스트에서 AS요청건을 선택해주세요.',
            desktop : false
          });
        }

        if($(this).hasClass('disabled')){
          return neoNotify.Show({
            text : '사용자가 AS예약접수 프로그램을 종료하여 실시간 AS를 사용할 수 없습니다.',
            type : 'error',
            desktop : false
          });
        }

        return _me.Live.Send($(this));
      },
      onClients : function(data){


         /* 새로 접속한 친구가 있네 */
         if(data.NEW){
           /* 전체 지사 검색이 아니네? */
           if(!_me.options.area){
             /* 내 담당도 아니네? 뭔데 안봐*/
             /* 메디본사 0030 을 본사 0000 으로 변경 */
             var hospArea = data.NEW.area;
             hospArea = hospArea === '0030' ? '0000' : hospArea;
             if(hospArea !== neo.user.user_area) return _SocketCheck();
           }

           /* 있는거야 알림 안해도되 */
           //if($('.as_item[data-index="'+data.NEW.id+'"]').length) return false;
           var existItem = $('.as-item[data-index="'+data.NEW.id+'"]');
           console.log(existItem);

           if(existItem.length) return _SocketCheck();

           /* 내꺼다이~ */
           neoNotify.Show({
             title : "NeoSoftBank A/S",
             text : '새로운 AS요청건이 접수되었습니다.',
             type : 'info',
             desktop : true
           });
           _me.listData.Load(data.TYPE, function(){
            _SocketCheck();
           });
           /* 리스트를 주엇네? */
         }else if(data.TYPE === 'LIST' || data.TYPE === 'LEAVE'){
            _SocketCheck();
         }else if(data.TYPE === 'CANCEL'){
           _me.listData.Load(null,function(){
            _SocketCheck();
            if(_me.selItem.$elem){
              if(_me.selItem.$elem.length){
                if(_me.selItem.index === parseInt(data.CLIENT)){
                  neoNotify.Show({
                    title : "NeoSoftBank A/S",
                    text : '열람중이던 A/S 요청건이 취소되었습니다.',
                    type : 'info',
                    desktop : true
                  });
                  _me.elem.clear();
                  _me.selItem.init();
                }

              }
            }
           });
         }

          /**
           * 소켓 연결 체크
           */
          function _SocketCheck(){
            $('span[data-name="연결상태"]').each(function(i,v){
              $(v).removeClass('badge-info');
            });

            data.CLIENTS.forEach(function(item){
              var asItem = $('.as-item[data-index="'+item.id+'"]');
              var wifi = $(asItem).find('span[data-name="연결상태"]');
              if(wifi){
                wifi.addClass('badge-info');
              }
            });
          }
      },
      onExeDetailClick : function(e){
        var type = $(this).attr('title');
        var target, ly, preSel;
        switch(type){
          case "실행파일":
            target = _me.elem.$lyMenu;
            target.empty();
            // target.selectpicker('destroy');
            ly = neo.emrs[_me.selItem.data.프로그램].layouts[$(this).selectpicker('val')];
            preSel = _me.selItem.data.실행메뉴;
          break;
          case "실행메뉴":
            target = _me.elem.$lyDetail;
            target.empty();
            // target.selectpicker('destroy');
            ly = neo.emrs[_me.selItem.data.프로그램].layouts[_me.elem.$lyExe.selectpicker('val')][$(this).selectpicker('val')];
            preSel = _me.selItem.data.세부화면;
          break;
          case "세부화면":
          return;
        }

        if(ly){
          if(!Array.isArray(ly)){
            ly = Object.keys(ly);
          }

          ly.forEach(function(item){
            var newItem = $('<option />').text(item);
            target.append(newItem);
          });
          target.selectpicker({size : 10}).selectpicker('refresh');

          if(preSel){
            target.selectpicker('val', preSel).trigger('changed.bs.select');
          }
        }

      },
      onHelp : function(){
        var helpImg = document.getElementById('commant_help');
        _me.events.onPopupImage(helpImg);
      },

      onChangeStatus : function(data){
        console.log(data);
        if(data.TYPE === 'STATUS'){ // 상태가 변한 이벤트가 와야하고
          swal.close();
          _me.listData.Load(null, function(){
            $.neoSocket.emitClients();

            if(_me.selItem.$elem){
              if(_me.selItem.$elem.length){
                if(_me.selItem.index === parseInt(data.item.id)){
                  var msg = ASSTATUS.ServiceName(data.STATUS);

                  neoNotify.Show({
                    title : "NeoSoftBank A/S",
                    text : '작업중이던 A/S 요청건이 ' + msg + '되었습니다.',
                    type : 'info',
                    desktop : true
                  });

                  if(data.STATUS <= ASSTATUS.TAKEOVERCONFIRM){
                    _me.selItem.$elem = $('a.as-item[data-index="'+_me.selItem.index+'"]');
                    _me.selItem.$elem.addClass('active').trigger('click');
                  }else{
                    _me.elem.clear();
                    _me.selItem.init();
                  }
                }

              }
            }
          });
        }
      }
    };

    /**
     * 라이브 AS
     */
    _me.Live = {
      LIVECOMMANDS : {
        LIVE : "LIVEAS",
        LIVEPARAM : "LIVEASCOMMAND",
        CAPTURE : "캡쳐",
        REEXECUTE : "프로그램 재실행",
        SEETROL : "시트롤 스탠바이",
        ROLLBACK : "버전롤백",
        LATESTUPDATE : "최신셋업적용",
        REINSTALL : "재설치"
      },
      lButton : null,
      lCaptureName : null,
      lCommand : null,
      lSendData : null,
      lRecData : null,
      ClearLive : function(callback){
        this.lButton = null;
        this.lCaptureName = null;
        this.lCommand = null;
        if(typeof callback === 'function'){
          return callback();
        }else{
          return false;
        }
      },
      Send : function(b){
        var _this = _me.Live;

        $.neoSocket.emitCheckLiveAS({id : _me.selItem.data.인덱스}, function(execute){
          console.log(execute);
          if(execute.liveas.command){
            return neoNotify.Show({
              title : '실시간 명령 실행',
              text : '이전에 실행한 명령이 아직 종료되지 않았습니다. 잠시후 다시 시도해주세요.',
              type : 'error',
              desktop : false
            });
          }else{
            var command = b.data('liveas');

            swal({
              title: command + ' 명령을 실행하시겠습니까?',
              text: "간헐적으로 명령이 실행이 되었음에도 피드백이 오지 않는경우가 있을 수 있습니다.",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: '네, 실행합니다.'
            }).then(function() {

              var sendData = {
                id : _me.selItem.data.인덱스,
                LIVEAS : {
                  member : neo.user.USER_ID,
                  command : _this.LIVECOMMANDS.LIVE + command,
                  params : _this.LIVECOMMANDS.LIVEPARAM + ":" + command,
                  oCommand : command,
                  oParams : {},
                  timer : b.data('timer')
                }
              };

              switch (command) {
                case _this.LIVECOMMANDS.CAPTURE:
                  var cDate = new Date();
                  sendData.LIVEAS.params += '%picName:' + window.btoa(cDate.GetToday('YYYYMMDDHHMMSS') + '' + neo.user.USER_ID + '' + _me.selItem.data.기관코드) + ".jpg";
                  sendData.LIVEAS.oParams.picName = window.btoa(cDate.GetToday('YYYYMMDDHHMMSS') + '' + neo.user.USER_ID + '' + _me.selItem.data.기관코드) + ".jpg";
                  break;
                case _this.LIVECOMMANDS.REEXECUTE:
                  break;
                case _this.LIVECOMMANDS.SEETROL:
                  swal({
                    title: command,
                    text: '스탠바이명칭과 서버를 입력해주세요.',
                    showCloseButton : true,
                    html:
                      '<input id="swal-input1" class="swal2-input" autofocus value="'+_me.selItem.data.기관명칭 + _me.selItem.data.기관코드 +'" placeholder="스탠바이명칭">' +
                      '<input id="swal-input2" class="swal2-input" value="medi.seetrol.com" placeholder="스탠바이 서버">',
                    preConfirm: function(result) {
                      return new Promise(function(resolve) {
                        if (result) {
                          resolve([
                            $('#swal-input1').val(),
                            $('#swal-input2').val()
                          ]);
                        }
                      });
                    }
                  }).then(function(result) {
                    sendData.LIVEAS.params += '%스탠바이명칭:' + result[0];
                    sendData.LIVEAS.params += '%서버명칭:' + result[1];
                    // swal(JSON.stringify(sendData.LIVEAS.params));
                    _me.selItem.onLive(true, command);
                    return $.neoSocket.emitLiveAS(sendData);
                  });
                  return;
                case _this.LIVECOMMANDS.ROLLBACK:
                  var versions = {};
                  neoAJAX.GetAjax({
                    url : '/versions',
                    data : {emr : _me.selItem.data.프로그램},
                    dataType : 'json',
                    async : true,
                    method : 'GET',
                    beforeSend : function(opts){

                    },
                    success : function(opts, data){
                      console.log(data);
                      $.each(data.data, function(i,v){
                        versions[v.배포버전] = v.배포버전;
                      });
                    },
                    callback : function(opts){
                      swal({
                        title : '버전리스트',
                        text : '적용하실 버전을 선택해주세요.',
                        input : 'select',
                        inputOptions : versions,
                        showCancelButton : true,
                        closeOnConfirm: false,
                      }).then(function(inputValue){
                        if(!inputValue){
                          swal.close();
                        }else{
                          sendData.LIVEAS.params += '%롤백버전:' + inputValue;
                          _me.selItem.onLive(true, command);
                          return $.neoSocket.emitLiveAS(sendData);
                        }
                      });
                    }
                  });
                  return;
                case _this.LIVECOMMANDS.LATESTUPDATE:
                  break;
                case _this.LIVECOMMANDS.REINSTALL:
                  break;
                default:
              }

              _me.selItem.onLive(true, command);
              $.neoSocket.emitLiveAS(sendData);
            });
          }
        });


      },
      Receive : function(data){
        var _this = _me.Live;
        var sendData = data.CLIENT.liveas;
        var target_id = data.CLIENT.id;
        var target_data = _me.listData.FindDataByID(target_id);
        var target_elem = _me.elem.FindElemByID(target_id);
        console.log(target_id, target_data);

        _me.selItem.onLive(false, sendData.oCommand, data.CLIENT.id);

        if(data.TYPE === 'LIVEAS'){
          if(data.STEP === 'TIMEOUT'){
            return neoNotify.Show({
              title : '실시간 명령 실행',
              text : "명령요청 시간이 초과했습니다. 인터넷속도, 사용자의 컴퓨터 상황에 따라 명령전달 소요시간이 길어질 수 있습니다.",
              type : 'error',
              desktop : true
            });
          }else if(data.STEP === 'RECEIVE'){
            if(data.RESULT != '200'){
              return neoNotify.Show({
                title : '실시간 명령 실행 실패',
                text : data.RESULT == '500' ? '명령 실행중 오류가 발생하였습니다.' : data.RESULT,
                type : 'error',
                desktop : true
              });
            }

            neoNotify.Show({
              title : '실시간 명령 실행 완료',
              text : sendData.oCommand + ' 명령이 실행되었습니다.',
              type : 'success',
              desktop : true
            });

            switch(sendData.oCommand){
              case _this.LIVECOMMANDS.CAPTURE:
                // var img = document.createElement('img');
                // img.setAttribute('src', 'uploads/' + sendData.oParams.picName);
                // img.setAttribute('style', 'width:100%');
                // img.setAttribute('class', 'img-preview');
                // // $('#'+target).summernote('insertNode', img);
                // _me.elem.$edit_q.summernote('insertNode', img);
                var img = $('<img />').addClass('img-preview').attr({
                            'src' : 'uploads/'+sendData.oParams.picName,
                            'style' : 'width:25%;'
                          });
                if(target_elem.is(_me.selItem.$elem)){
                  $('span#question').prepend(img);
                  var question = _me.elem.$edit_q.summernote('code');
                  target_data.문의내용 = question.substring(0,question.indexOf('<table id="personInfo"')); //
                }else{
                  _me.selItem.imgStack[target_id] = {
                    id : target_id,
                    img : img
                  };
                }

                break;
              case _this.LIVECOMMANDS.REEXECUTE:
                break;
              case _this.LIVECOMMANDS.SEETROL:
                break;
              case _this.LIVECOMMANDS.ROLLBACK:
                break;
              case _this.LIVECOMMANDS.LATESTUPDATE:
                break;
              case _this.LIVECOMMANDS.REINSTALL:
                break;
              default:
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
      _me.library.init();
      return callback();
    };



    _me.Initialize(function(){
      try{
        JSInterface.LoginUser(neo.user.USER_ID, neo.user.user_area);
      }catch(e){
        console.log(e);
      }
      _me.listData.Load(null,function(){
        $.neoSocket.module = _me;
        $.neoSocket.emitClients();
      });

    });

  };

  // NeoAS();
  $.neoAS = NeoAS;

})(window);
