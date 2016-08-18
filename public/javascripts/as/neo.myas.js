(function(){

  var NeoMY = function(){

    var _me = this;

    _me.options = {
      workDate : null,    // 작업일자
      workState : null,   // 서비스상태,
      workTab : null,
      user : neo.user,     // 작업유저
      init : function(){
        var wDate = new Date();
        this.workDate = wDate.GetToday('YYYY-MM-DD');
        this.workState = ASSTATUS.TAKEOVERCONFIRM;
        this.workTab = 'WORKING';
        this.user = neo.user;
        return;
      }
    };
    _me.editor = {
      toolbar : [
          ['mybutton', ['capture', 'done']],
          ['style', ['bold', 'italic', 'underline', 'clear']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']]
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
        popupImage : function(context){
          var ui = $.summernote.ui;
          var button = ui.button({
            contents : '<i class="fa fa-image"></i>',
            tooltip: '크게보기',
            buttonID : 'popupImage',
            click : function(){_me.events.onPopupImage(context);}
          });
          return button.render();
        }
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
         * 1. 전체날짜 작업중인거
         * 2. 전체날짜 완료한거
         */

        /**
         * 1. 전체날짜 작업중인거
         */
        var options = {
          target_list : _me.elem.list.lists.WORKING,
          target_tab : _me.elem.list.tabs.WORKING,
          beforeSend : _beforeSend,
          url : 'clients/list',
          data : {
            // date : _me.options.workDate,
            type: 'MYAS',
            status : _me.elem.list.tabs.WORKING.data('type'),
            search : this.search || "",
            user : _me.options.user.USER_ID
          },
          dataType : 'json',
          async : true,
          method : 'GET',
          success : _beforeLoaded,
          callback : _afterLoaded
        };
        neoAJAX.as.list(options);

        /**
         * 2. 전체날짜 진행중인거 로드
         */
        options = {
          target_list : _me.elem.list.lists.DONE,
          target_tab : _me.elem.list.tabs.DONE,
          beforeSend : _beforeSend,
          url : 'clients/list',
          data : {
            // date : _me.options.workDate,
            type: 'MYAS',
            status : _me.elem.list.tabs.DONE.data('type'),
            search : this.search || "",
            user : _me.options.user.USER_ID
          },
          dataType : 'json',
          async : true,
          method : 'GET',
          success : _beforeLoaded,
          callback : _afterLoaded
        };
        neoAJAX.as.list(options);

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
          opts.target_list.find('div.spiner-example').remove();
          neoModules.SetElementHeight();
          if(typeof callback === 'function') return callback();
        }

      },
      MoveData : function(sItem, callback){
        /**
         * 접수에서 접수는 있을수 없고
         * 접수에서 확인, 인계, 완료
         * 인계에서 인계
         * 인계확인에서 인계확인
         * 데이터가 이동하는 경우는 확인, 인계뿐인다.
         */
        var _this = _me.listData;
        var statusName, tab, list;

        /* find original item */
        var oKeys = Object.keys(_this.data);
        var oItem = null, elem = _me.elem.list;
        /* ACCEPT, WORKING, CANCEL 배열을 하나씩 선택한다. */
        oKeys.some(function(item, index, arr){
          if(_this.data[item]){
            /* 해당 배열에서 움직일 데이터를 찾는다 */
            oItem = _this.data[item].find(function(data, subindex){
              if(data.인덱스 === sItem.인덱스){ //찾았다!

                if(item === 'ACCEPT'){
                  /* 접수 - > 진행중(확인, 인계) */
                  if(sItem.서비스상태 > ASSTATUS.ACCEPT && sItem.서비스상태 < ASSTATUS.DONE ){
                    _this.data[item].splice(subindex,1);
                    _this.data.WORKING.push(data);
                    _me.selItem.id = _this.data.WORKING.length - 1;
                  }
                  /* 접수 - > 취소 */
                  else if(sItem.서비스상태 === ASSTATUS.CANCEL){
                    _this.data[item].splice(subindex,1);
                    _this.data.CANCEL.push(data);
                    _me.selItem.id = _this.data.CANCEL.length - 1;
                  }
                  /* 접수 - > 완료 */
                  else if(sItem.서비스상태 === ASSTATUS.DONE){
                    _this.data[item].splice(subindex,1);
                  }
                }else if(item === 'WORKING'){
                  /* 진행 - > 진행 */
                  if(sItem.서비스상태 > ASSTATUS.ACCEPT && sItem.서비스상태 < ASSTATUS.DONE ){

                  }
                  /* 진행 - > 취소 */
                  else if(sItem.서비스상태 === ASSTATUS.CANCEL){
                    _this.data[item].splice(subindex,1);
                    _this.data.CANCEL.push(data);
                    _me.selItem.id = _this.data.CANCEL.length - 1;
                  }

                  /* 진행 - > 완료 */
                  else if(sItem.서비스상태 === ASSTATUS.DONE){
                    _this.data[item].splice(subindex,1);
                  }
                }
                return data;
              }
            });
            return oItem !== null;
          }
        });

        if(typeof callback === 'function'){
          return callback();
        }else{
          return false;
        }

      },
      GetNewOne : function(newOne, callback){
        var _this = _me.listData;
        var newItem;
        var options = {
          url : 'clients/item',
          data : {id : newOne.id},
          dataType : 'json',
          async : true,
          method : 'GET',
          success : _beforeLoaded,
          callback : callback
        };
        neoAJAX.as.list(options);

        function _beforeLoaded(opts, data){
          if(data.err){
            return neoNotify.Show({
              text : '새로운 AS요청건을 불러오는 도중 오류가 발생하였습니다. 새로고침해주세요. \n ' + data.err,
              type : 'error',
              desktop : true
            });
          }

          _this.data.ACCEPT.push(data.data[0]);
          counter = _this.data.ACCEPT.length;
          newItem = _me.elem.list._SetNewItem(_me.elem.list.$accept, data.data[0], counter - 1, true);
              newItem.bind('click', _me.events.onAccepItemClick);
          _me.elem.list._SetTabCount(_me.elem.list.$acceptTab, counter);

          return true;
        }

      },//GetNewOne
      FindDataByIndex : function(index){  // 배열의 인덱스로 찾기
        //TODO
      },//FindDataByIndex
      FindDataByID : function(id){  // 배열의 데이터의 인덱스값으로 찾기 (필드이름이 인덱스임)
        var _this = _me.listData;
        var selItem = null;
        $.each(_this.data, function(index, arr){
          console.log(index, arr);
          selItem = arr.find(function(item){
            return parseInt(item.인덱스) === parseInt(id);
          });

          if(selItem) return false;
        });
        return selItem;
      }
    };

    _me.selItem = {
      $elem : null,
      data : null,
      id : null,    // 배열의 인덱스 번호
      socket : false,
      init : function(){
        this.$elem = null;
        this.data = null;
        this.id = null;
        this.socket = false;
        return;
      },
      Load : function(elem){
        var _this = _me.selItem;
        _this.$elem = elem;
        _this.id = _this.$elem.data('id');
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
          }else{
            //$('#as-confirm').addClass(_this.data.서비스상태 === ASSTATUS.ACCEPT ? '' : 'disabled');
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

          if(_this.data.서비스상태 === ASSTATUS.DONE){
            _me.elem.$asStatus.addClass('disabled');
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
        var cData = JSON.parse(JSON.stringify(_this.data));
        /* 선택된 AS건의 데이터 갱신 */
        cData.서비스상태 = status;
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
            cData.문의내용 = _me.elem.$edit.summernote('code');
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
            cData.문의내용 = _me.elem.$edit.summernote('code');
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
          _me.listData.MoveData(_this.data, function(){
            _this.$elem.attr('data-id', _this.id);
            _me.elem.RefreshElem(_this.$elem, _this.data);
            _me.elem.RefreshTabCount();
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

    /**
     * SET TEMPLATE OR GET ELEMENT
     */
    _me.elem = {
      list : {
        tabs : {},
        lists : {},
        _SetTabCount : function(obj, count){
          return obj.find('small').text(count);
        },
        _SetNoItem : function(obj){
          return obj.append('<a class="list-group-item"><h3 class="text-muted font-bold"> 검색된 데이터가 없습니다. </h3></a>');
        },
        _SetNewItem : function(obj, item, index, first){
          var $item = _me.elem.$item.clone();

          $item.addClass('animated fadeInUp');
          $item.attr({'data-id' : index, 'data-index' : item.인덱스, 'data-animated' : 'fadeInUp'});
          $item.find('span[data-name="접수일자"]').text(item.접수일자);

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
      $item : null,
      $search_i : null,         // 검색어입력박스
      $tblhosp : null,          // 병원정보테이블
      $custom : null,           // 사용자정의
      $library : null,          // 문의내용 검색
      $liveas : null,           // 실시간 AS 명령 버튼 + 캡쳐버튼
      $asStatus : null,         // AS 상태변경 버튼
      $edit : null,           // 문의내용 에디터
      $status : null,            // 상태바
      init : function(){

        var _this = _me.elem;

        $('.myas-tab').each(function(index, elem){
          _this.list.tabs[$(elem).data('name')] = $(elem);
        });
        $('a.myas-tab').bind('click', _me.events.onTabClick);
        $('.myas-list').each(function(index, elem){
          _this.list.lists[$(elem).data('name')] = $(elem);
        });
        neoAJAX.GetTemplate('as-request-accept_item' , function(view){
          _this.$item = $(view);
        });

        _this.$search_i = $('input#as_search');
        _this.$tblhosp = $('table tr td.tb-value');
        // _this.$custom = $('di')    // 사용자정의
        // _this.library = $();       // 문의내용 검색
        _this.$status = $('div.as_status');

        _this.$edit = $('#as_question');
        $(_this.$edit).summernote({
          toolbar  : _me.editor.toolbar,
          popover : _me.editor.popover,
          lang : 'ko-KR',
          height: 500,
          buttons : _me.editor.buttons
        });
        this.SetTemplate(this.$edit);

        _this.$liveas = $('.as-lives-item');
        _this.$liveas.bind('click', _me.events.onExecuteLiveAS);

        _this.$asStatus = $('.as-status-btn');
        _this.$asStatus.bind('click', _me.events.onUpdateAS);

        /**
         * Set Layout
         */
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

        return this.initEvents();
      },
      initEvents : function(){

        this.$search_i.bind('keyup', _me.events.onSearch);

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
        this.$edit.summernote('code', '');
        // this.SetTemplate(this.$edit_q);

        /**
         * 상태바 초기화
         */


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


        if(typeof callback === 'function') return callback();
        else return;
      },
      RefreshTabCount : function(){
        var data = _me.listData.data;
        // this.list._SetTabCount(this.list.$acceptTab, data.ACCEPT ? data.ACCEPT.length : 0);
        // this.list._SetTabCount(this.list.$workingTab, data.WORKING ? data.WORKING.length : 0);
        // this.list._SetTabCount(this.list.$cancelTab, data.CANCEL ? data.CANCEL.length : 0);
      },
      /**
       * 변경된 AS요청건을 새로고침하는 부분이다
       * 메세지로 넘어온 요청건은 추가만하고 포커스 이동이 되면 안된다. ( 사용자 AS접수, 다른 네오직원 상태변경 )
       */
      RefreshElem : function(elem, data){
        // var _this = _me.elem;
        // var parent = $(elem.parent()).data('type');
        //   if(typeof parent === 'number') parent = parent.toString();
        // var newOne = null, newParent = null, newTab = null;
        //
        // if(data.서비스상태 === ASSTATUS.DONE){
        //   // elem.find('div.progress-bar-success').css('width' , '100%');
        //   // elem.find('div.progress-bar-danger').addClass('hidden');
        //   // // 클리어시키자~
        //   elem.addClass('fadeOutRightBig');
        //   elem.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
        //   function(e) {
        //     elem.remove();
        //     _me.clear();
        //   });
        //
        // }else{
        //   if(data.서비스상태 === ASSTATUS.CANCEL){
        //     elem.find('div.progress-bar-success').addClass('hidden');
        //     elem.find('div.progress-bar-danger').css('width' , '100%');
        //     newParent = _this.list.$cancel;
        //     newTab = _this.list.$cancelTab;
        //   }else{
        //     elem.find('div.progress-bar-success').css('width' , (data.서비스상태 * 20) + '%');
        //     elem.find('div.progress-bar-danger').css('width' , '20%');
        //     newParent = _this.list.$working;
        //     newTab = _this.list.$workingTab;
        //   }
        //   if(parent.indexOf(data.서비스상태) < 0){ /* 새로운 부모에게 가야한다 */
        //     newOne = elem.clone();
        //     newOne.bind('click', _me.events.onAccepItemClick);
        //     elem.addClass('animated fadeOutRightBig');
        //     elem.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
        //     function(e) {
        //       newTab.tab('show')
        //             .on('shown.bs.tab', function(){
        //               _me.options.workTab = newTab.data('name');
        //               newParent.prepend(newOne);
        //               elem.remove();
        //               _me.selItem.Load(newOne);
        //             });
        //     });
        //   }else{
        //      /* 그자리에 가만히 잇으면 된다! */
        //      _me.selItem.Load(elem);
        //   }
        // }



      },
      FindElemByID : function(id){
        return $('.as-item[data-index="'+id+'"]');
      },//FindElemByIdD
      SetTemplate : function(force, callback){
        var Tmplt = "";
        var target = this.$edit;
        Tmplt = '<span class="template"><h4><b><u>1. 이미지</u></b></h4><h4>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: rgb(107, 113, 122); font-size: 13px; line-height: 1.42857;">{첨부이미지}</span></h4><h4 style="font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; color: rgb(0, 0, 0);"><b><u>2. 문의내용 ( 병원용 )</u></b></h4><h4>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: rgb(107, 113, 122); font-size: 13px; line-height: 18.5714px; font-family: inherit;">{문의내용}</span></h4><h4 style="font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; color: rgb(0, 0, 0);"><b><u>3. 확인내용 ( 담당자용 )</u></b></h4><h4 style="font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; color: rgb(0, 0, 0);">&nbsp; &nbsp;&nbsp;<span style="color: rgb(107, 113, 122); font-size: 13px; line-height: 18.5714px; font-family: inherit;">{오류내용}</span></h4><h4><b><u>4. 처리내용</u></b></h4><h4 style="font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; color: rgb(0, 0, 0);">&nbsp; &nbsp;&nbsp;<span style="color: rgb(107, 113, 122); font-size: 13px; line-height: 18.5714px; font-family: inherit;">{처리내용}</span></h4><h4>&nbsp; &nbsp;&nbsp;<b><u><br></u></b></h4><table class="table table-bordered"><tbody><tr><td>접수자 정보</td><td>확인자 정보</td><td>인계자 정보</td><td>처리자 정보</td></tr><tr><td><p>접수자 : {접수자}</p><p>연락처 : {접수자연락처}</p></td><td><p>확인자 : {확인자}</p><p>연락처 : {확인자연락처}</p></td><td><p>인계자 : {인계자}</p><p>연락처 : {인계자연락처}</p></td><td><p>처리자 : {처리자}</p><p>연락처 : {처리자연락처}</p></td></tr></tbody></table><h4><b><u><br></u></b></h4><h4><b><u><br></u></b></h4></span>';

        Tmplt = Tmplt.replace('{첨부이미지}', '<span id="uploadImage"></span>');
        Tmplt = Tmplt.replace('{문의내용}', '<span id="question"></span>');
        Tmplt = Tmplt.replace('{오류내용}', '<span id="error"></span>');
        Tmplt = Tmplt.replace('{처리내용}', '<span id="done"></span>');
        Tmplt = Tmplt.replace('{접수자}', '<span id="accept"></span>');
        Tmplt = Tmplt.replace('{접수자연락처}','<span id="acceptcontact"></span>');
        Tmplt = Tmplt.replace('{확인자}','<span id="confirm"></span>');
        Tmplt = Tmplt.replace('{확인자연락처}','<span id="confirmcontact"></span>');
        Tmplt = Tmplt.replace('{인계자}','<span id="takeover"></span>');
        Tmplt = Tmplt.replace('{인계자연락처}','<span id="takeovercontact"></span>');
        Tmplt = Tmplt.replace('{처리자}','<span id="confirm"></span>');
        Tmplt = Tmplt.replace('{처리자연락처}','<span id="confirmcontact"></span>');


        var item = _me.selItem.data;
        Tmplt = $(Tmplt);
        if(item){

          var question = $(item.문의내용.trim());

          if(!force){ //강제적용
            if(question.hasClass('template')){
              target.summernote('code', item.문의내용);
              return false;
              // return neoNotify.Show({
              //   text : '이미 양식지를 적용하여 작성된 문서입니다.',
              //   type : 'error',
              //   desktop : false
              // });
            }
          }

          var imgs = question.find('img');
          if(imgs && imgs.length){
            imgs.each(function(index, item){
              var subItem = $(item).clone();
              Tmplt.find('span#uploadImage').append(subItem);
              $(item).remove();
            });
          }
          Tmplt.find('span#question').html(question);

          Tmplt.find('span#accept').text(item.접수자.trim());
          Tmplt.find('span#acceptcontact').text(item.접수연락처.trim());
          Tmplt.find('span#confirm').text(item.확인자.trim() || neo.user.USER_NAME);
          Tmplt.find('span#confirmcontact').text(item.확인자연락처.trim() || (neo.user.info_hp || neo.user.info_tel));

          Tmplt.find('span#takeover').text(item.인계자.trim() || neo.user.USER_NAME);
          Tmplt.find('span#takeovercontact').text(item.인계자연락처.trim() || (neo.user.info_hp || neo.user.info_tel));
        }else{
          Tmplt.find('span#confirm').text(neo.user.USER_NAME);
          Tmplt.find('span#confirmcontact').text(neo.user.info_hp || neo.user.info_tel);
          Tmplt.find('span#takeover').text(neo.user.USER_NAME);
          Tmplt.find('span#takeovercontact').text(neo.user.info_hp || neo.user.info_tel);
        }

        target.summernote('code', Tmplt);

        if(typeof callback === 'function'){
          return callback();
        }else{
          return;
        }
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
      onTabClick : function(e){
        _me.options.workTab = $(this).data('name');
        $.neoSocket.emitClients();
      },

      /**
       * AS확인, 인계접수, 처리완료
       */
      onUpdateAS : function(){
        if($(this).hasClass('disabled')) return false;
        //alert($(this).data('type'));
        var type = parseInt($(this).data('type'));
        var msg;
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
             if(data.NEW.area !== neo.user.user_area) return _SocketCheck();
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
           _me.listData.Load(function(){
            _SocketCheck();
           });
           /* 리스트를 주엇네? */
         }else if(data.TYPE === 'LIST' || data.TYPE === 'LEAVE'){
            _SocketCheck();
         }else if(data.TYPE === 'CANCEL'){
           _me.listData.Load(function(){
            _SocketCheck();
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


        }
      // }
    };


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

            _me.selItem.onLive(true, command);

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
                        alert(result);
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
                  return $.neoSocket.emitLiveAS(sendData);
                });
                return;
              case _this.LIVECOMMANDS.ROLLBACK:
                break;
              case _this.LIVECOMMANDS.LATESTUPDATE:
                break;
              case _this.LIVECOMMANDS.REINSTALL:
                break;
              default:
            }

            $.neoSocket.emitLiveAS(sendData);

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
                  $('span#uploadImage').append(img);
                  target_data.문의내용 = _me.elem.$edit.summernote('code');
                }else{
                  var con = $('<div />');
                  var comment = $(target_data.문의내용);
                  con.append(comment);
                  if(comment.hasClass('template')){
                    $(comment.find('span#uploadImage')).append(img);
                  }else{
                    con.append('<span id="uploadImage"></span>');
                    $(con.find('span#uploadImage')).append(img);
                  }
                  target_data.문의내용 = $(con).html();
                }
                /**
                 * 1. 지금 선택한 AS건이 AS명령을 보낼때와 같으면 에디터에 뿌려주고
                 * 2. 다르면 문의내용쪽에 저장해두어야 한다.
                 * 3. 만약 문의내용에서 템플릿을 적은적이 있다면
                 * 4. uploadImage 엘리먼트를 찾아서 넣어야한다.
                 */

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
      return callback();
    };



    _me.Initialize(function(){
      _me.listData.Load(function(){
        $.neoSocket.module = _me;
        $.neoSocket.emitClients();
      });

    });

  };

  // NeoAS();
  $.neoMY = NeoMY;

})(window);
