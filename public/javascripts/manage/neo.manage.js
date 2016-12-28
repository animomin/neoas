(function(exports){
  'use strict';

  /**
   * Template Module
   */
  function Template(){
    console.log('template');
    this.defaultVisitPlaceHolder = '' +
    '<div>※ 방문형태: </div>' +
    '<div><br></div>' +        
    '<div>1. 특이사항</div>' +
    '<div><br></div>' +
    '<div>2. 부서별 오류 / 요청사항&nbsp;</div>' +
    '<div><br></div>' +
    '<div>3. AS 접수내역 및 개발진행 사항</div>' +
    '<div><br></div>';

    this.defaultTelPlaceHolder = '' +    
    '<div>Q. 문의내용</div>' +
    '<div><br></div>' +
    '<div><br></div>' +
    '<div>A. 처리내용</div>' +
    '<div><br></div>' +
    '<div><br></div>';

    this.defaultHospListNoData = '' +
    '<tr>' +
    ' <td colspan="3" class="text-center"><h4 class="text-center">No Results</h4></td>' +    
    '</tr>';

    this.defaultHospListItem = '' +
    '<tr class="hosp-item" data-id="{{ID}}" data-index="{{INDEX}}" data-hospnum="{{기관코드}}">' +
    ' <td>{{번호}}</td>' +
    ' <td>{{기관명칭}} / {{기관코드}}</td>' +    
    ' <td>' +
    //'   <button class="btn btn-default btn-xs history-write" data-index="{{INDEX}}" data-toggle="modal" data-target="#history-write-dialog"><i class="fa fa-pencil"></i></button></td>' +
    '   <button class="btn btn-default btn-xs history-write" data-index="{{INDEX}}"><i class="fa fa-pencil"></i></button></td>' +
    '</tr>';

    this.defaultHistoryListItem = '' +
    '<tr>' +
    '  <td class="hidden" data-name="인덱스">{{인덱스}}</td>' +
    '  <td class="hidden" data-name="USER_ID">{{USER_ID}}</td>' +    
    '  <td class="breakpoints-xs" data-name="기관코드">{{기관코드}}</td>' +
    '  <td data-name="기관명칭">{{기관명칭}}</td>' +
    '  <td class="breakpoints-xs breakpoints-sm">{{프로그램}}</td>' +
    '  <td data-name="처리일자">{{처리일자}}</td>' +
    '  <td data-name="작성자" data-value="{{작성자}}">{{작성자이름}}</td>' +
    '  <td class="breakpoints-xs breakpoints-sm">{{작성일자}}</td>' +
    
    ' <td>' +
    //'   <button class="btn btn-default btn-xs history-write" data-index="{{INDEX}}" data-toggle="modal" data-target="#history-write-dialog"><i class="fa fa-pencil"></i></button></td>' +
    '   <button class="btn btn-default btn-xs fa fa-pencil" data-type="edit"></button>' +
    '   <button class="btn btn-default btn-xs fa fa-trash" data-type="remove"></button></td>' +
    '</tr>';

    this.defaultASListItem = '' +
    '<tr>' +
    '  <td class="breakpoints-xs breakpoints-sm" data-name="인덱스">{{인덱스}}</td>' +
    '  <td class="breakpoints-xs" data-name="기관코드">{{기관코드}}</td>' +
    '  <td data-name="기관명칭">{{기관명칭}}</td>' +
    '  <td class="breakpoints-xs breakpoints-sm">{{프로그램}}</td>' +
    '  <td>{{서비스타입}}</td>' +
    '  <td class="breakpoints-xs breakpoints-sm breakpoints-md">{{접수자}}</td>' +
    '  <td>{{접수일자}}</td>' +    
    '  <td>{{서비스상태}}</td>' +
    '  <td>{{처리자}}</td>' +    
    '</tr>';

    this.defaultHospitalInfo = '' +
    '<p class="animated fadeInDown">' +
    '   <span class="h4 border-bottom">{{기관명칭}}' +
    '     <span class="h5">{{기관코드}}</span>' +
    '   </span>' +
    ' <dl class="animated fadeInDown">' +
    '  <dd><span class="font-bold">프로그램 : </span>{{프로그램}}</dd>' +
    '  <dd><span class="font-bold">진료과목 : </span>{{진료과목}}</dd>' +
    '  <dd><span class="font-bold">기관대표 : </span>{{기관대표}}</dd>' +
    '  <dd><span class="font-bold">전화번호 : </span>{{전화번호}}</dd>' +
    '  <dd><span class="font-bold">팩스번호 : </span>{{팩스번호}}</dd>' +
    '  <dd><span class="font-bold">휴대폰번호 : </span>{{휴대폰번호}}</dd>' +
    '  <dd><span class="font-bold">주소 : </span>{{주소}}</dd>' +
    '  <dd><span class="font-bold">이메일 : </span>{{이메일}}</dd>' +
    ' </dl>' +
    ' <dl class="animated fadeInDown">' +    
    '  <dd><span class="font-bold">담당자 : </span>{{담당자}}</dd>' +
    '  <dt>부가서비스</dt>' +
    '  <dd><ul class="tag-list" style="padding:0">{{부가서비스}}</ul></dd>' +
    ' </dl>' +
    '</p>';

    this.defaultExtraService = '<li><a href="#">{{부가서비스}}</a></li>';

   
    // 


  }

  Template.prototype.insertHospItem = function(data){
    console.log('Template.insertHospItem method execute!');
    var view = '';
    if(data){
      for(var i = 0; i < data.length; i++){
        var template = this.defaultHospListItem;

        template = template.replace(/{{INDEX}}/gim, i);
        template = template.replace(/{{ID}}/gim, data[i].USER_ID);
        template = template.replace('{{번호}}', i + 1);
        template = template.replace('{{기관명칭}}', data[i].기관명칭);
        template = template.replace(/{{기관코드}}/gim, data[i].기관코드);
        template = template.replace('{{프로그램}}', data[i].프로그램);
        template = template.replace('{{대표자}}', data[i].대표자);

        view = view + template;
      }
    }else{
      view = this.defaultHospListNoData;
    }
    return view;
  };

  Template.prototype.insertHistoryItem = function(data){
    var view = '';
    for(var i = 0; i < data.length; i++){
      var template = this.defaultHistoryListItem;
      template = template.replace('{{인덱스}}', data[i].인덱스);
      template = template.replace('{{USER_ID}}', data[i].USER_ID);
      template = template.replace('{{기관코드}}', data[i].기관코드);
      template = template.replace('{{기관명칭}}', data[i].기관명칭);
      template = template.replace('{{프로그램}}', data[i].프로그램);
      template = template.replace('{{처리일자}}', data[i].처리일자);
      template = template.replace('{{작성자}}', data[i].작성자);
      template = template.replace('{{작성자이름}}', neo.users.GetUserName(data[i].작성자).USER_NAME);
      template = template.replace('{{작성일자}}', data[i].작성일자);      

      view = view + template;
    }
    return view;
  }

  Template.prototype.insertASItem = function(data, page){
    var view = '';
    // for(var i = 0; i < data.length; i++){
    var start = (page - 1) * 20;
    var end = page * 20;
        end = data.length < end ? data.length : end; 
    for(var i = start ; i < end; i++){
      var template = this.defaultASListItem;
      template = template.replace('{{인덱스}}', data[i].인덱스);      
      template = template.replace('{{기관코드}}', data[i].기관코드);
      template = template.replace('{{기관명칭}}', data[i].기관명칭);
      template = template.replace('{{프로그램}}', (function(){
          var value = data[i].프로그램;
          if (value === "" || typeof value === "undefined") value = 0;
          switch (parseInt(value)) {
              case 1:
                  return 'Eplus';
              case 8:
                  return 'MediChart';
              case 20:
                  return 'SENSE'
          }
      }));
      template = template.replace('{{접수자}}', data[i].접수자);
      template = template.replace('{{접수일자}}', data[i].접수일자);
      template = template.replace('{{처리자}}', data[i].처리자);
      template = template.replace('{{서비스상태}}', ASSTATUS.ServiceName(parseInt(data[i].서비스상태)));      

      var typename;
      switch (parseInt(data[i].서비스타입)) {
        case 0:
          typename='선택없음';
          break;
        case 1:
          typename='장애';
          break;
        case 2:
          typename='사용법';
          break;
        case 3:
          typename='개선';
          break;
        case 4:
          typename='기타';
          break;
      }
      template = template.replace('{{서비스타입}}', typename);


      view = view + template;
    }
    return view;
  };

  Template.prototype.insertASItemPagination = function(data){
    var view = '';
    var pages = Math.ceil(data.length / 20);
    
    view += '<li class="disabled" data-type="prev" data-pages="'+pages+'" data-curpage="1"><a href="#"> 이전 </a></li>';
    view += '<li class="' + (pages > 1 ? '' : 'disabled') + '" data-type="next" data-pages="'+pages+'" data-curpage="1"><a href="#"> 다음 </a></li>';    

    return view;

  };

  Template.prototype.getTableColumns = function(i){
    var columns = i == 2 ? this.historyTableColumns[1] : this.historyTableColumns[0];
    return columns;
  };

  Template.prototype.setHistoryTable = function(i, $_table, data){
    console.log(data);
    var columns = i == 2 ? this.historyTableColumns[1] : this.historyTableColumns[0];
    $_table.rows.load(data);    
  };

  /**
   * View Module
   */
  function View(template){
    console.log('View');
    var self = this;
    this.template = template;

    this.$areaAll = $('button#area-all');
    this.$hospSearch = $('input#search');
    this.$hospitalList = $('tbody#hospital-list');
    this.$hospManager = $('select.neoMembers');
    this.$hospitalTable = this.$hospitalList.parent();    
    
    // this.$hospitalInfo = $('table.hospital-info tr td');
    this.$hospitalInfo = $('div#hospital-info');
    this.$hospitalUniqInfo = $('table.hospital-info tr td');
    this.$hospitalUniq = $('button[data-target="#hospital-uniq-dialog"]');
    this.$hospitalUniqWriteDate = $('small#uniq-writedate');
    if(mobile){
      this.$hospitalTabs = $('a.hospital-tabs');
    }

    this.$historySearch = $('button#history-search');
    this.$historyKeyword = $('input#history-keyword');
    this.$historyQuickDate = $('button.history-quickDate');
    this.$historyTabs = $('a.history-tabs');
    this.$historyDate = $('div.input-daterange input');    
    this.$historyTable = $('table.history-table')    
    
    this.$historyWrite = $('div#history-body');
    this.$historyWriteType = $(':input:radio[name="history-type"]');
    this.$historyWriteNotice = $('span#history-write-notice');
    
    
    //Pages
    this.$page = $('div.page');
    this.$historyEditor = this.$page.find('textarea.editor');

    //Modls
    this.$uniqDialog = $('div#hospital-uniq-dialog');
    var temp = this.$hospManager;

    temp.prepend('<option value=""> 전체 </option>');
    neo.users.forEach(function(_m){
      if(_m.USER_ID === neo.user.USER_ID){
        temp.prepend('<option value="'+_m.USER_ID+'">' + _m.USER_NAME + '</option>');
      }else{
        temp.append('<option value="'+_m.USER_ID+'">' + _m.USER_NAME + '</option>');
      }      
    });
    temp.each(function(i,v){
      $(v).selectpicker({
        width : 'fit',
        liveSearch : true,
        size : 5,
        title : $(v).data('title')
      });
    });
    temp = this.$uniqDialog.find('select#uniq-extra-service');
    temp.selectpicker({      
      size : 5
    });

    
    
    
    
    this.$historyEditor.summernote({
      toolbar : [['style', ['bold', 'italic', 'underline', 'clear']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']]],
          // ['picture', ['picture']]],
      lang : 'ko-KR',
      height : 400,
      // placeholder : self.template.defaultVisitPlaceHolder,
      buttons : {},
      callbacks: {
        onInit: function() {
          self.$historyEditor_PlaceHolder = $('div.note-placeholder');
        }
      }
    });

    this.$historyDate.each(function(i,v){
      // var today = new Date().GetToday('YYYY-MM');
      // var lastday = (new Date( today.split('-')[0], today.split('-')[1], 0)).GetDate_CustomFormat('YYYY-MM-DD');
      var today = new Date().GetDate_CustomFormat('YYYY-MM-DD');
      var yesterday = new Date();
          yesterday.setDate(yesterday.getDate()-1);      
      yesterday = yesterday.GetDate_CustomFormat('YYYY-MM-DD');
      $(v).val($(v).data('name') === 'start' ?  yesterday : $(v).data('name') === 'end' ? today : new Date().GetToday('YYYY-MM-DD'));
      $(v).datepicker({
          format : 'yyyy-mm-dd',
          language:'kr',
          startView: 2,
          keyboardNavigation: false,
          forceParse: false,
          autoclose: true,
          todayHighlight: true,
          todayBtn : 'linked'
      });
    });


    if(neo.user.user_area !== '0000'){
      var p = this.$areaAll.parent();
      p.addClass('hidden').siblings().removeClass('hidden');
      p = null;      
    }
    
  }

  View.prototype.bind = function(event, handler){
    var self = this;

    /**
     * event : 'areaAll'
     */
    if(event === 'areaAll'){
      console.log('View.bind.areaAll execute!');
      var temp = self.$areaAll;
      temp.unbind('click').bind('click', function(){
        $(this).toggleClass('active');
        handler($(this).hasClass('active'));
      });

    /**
     * event : 'hospSearch'
     */
    }else if(event === 'hospSearch'){
      console.log('View.bind.hospSearch execute!');
      var temp = self.$hospSearch;
      temp.unbind('keyup').bind('keyup', function(event){
        if(event.type == 'keyup' && (event.keyCode == 13 || event.key == 'Enter')){
          handler($(this).val().trim());
        }
      });

      var temp = self.$hospManager;
      temp.unbind('changed.bs.select').bind('changed.bs.select', function(event){
        handler(self.$hospSearch.val().trim());
      });
      
    /**
     * event : 'hospClick'
     */     
    }else if(event === 'hospClick'){
      console.log('View.bind.hospClick execute!');
      var temp = self.$hospitalTable;
      temp.unbind('click').bind('click', function(event){
        var target = event.target;
        var parent = null;
        var params = {};
        if(target.tagName.toLowerCase() === 'i'){
          parent = $(target).parent().parent().parent();
          params = {index : $(target.parentNode).data('index')};
          
        }else if(target.tagName.toLowerCase() === 'button'){
          parent = $(target).parent().parent();
          params = {index : $(target).data('index')};          
        }else if(target.tagName.toLowerCase() === 'td'){
          parent = $(target.parentNode);
          params =  {
            id : $(parent).data('id'),
            start : self.$historyDate.filter('[data-name="start"]').val(),
            end : self.$historyDate.filter('[data-name="end"]').val()
          };
          
          
        }

        if(parent.hasClass('hosp-item')){
            $(parent).toggleClass('active').siblings().removeClass('active');            
        } 
        handler(params);
      })
    
    }else if(event === 'historyWriteType'){

      console.log('View.bind.historyWriteType execute');
      var temp = self.$historyWriteType;
      temp.unbind('click').bind('click', function(event){
        if($(this).val() == 0){
          // self.$historyEditor_PlaceHolder.empty().append(self.template.defaultVisitPlaceHolder);
          self.$historyEditor.summernote('code', self.template.defaultVisitPlaceHolder);
          self.$historyWriteNotice.text('반드시 양식에 맞춰 작성할 것! / 방문형태 상단 필수 작성 ( 정기 or 요청 or 영업 )');
        }else{
          // self.$historyEditor_PlaceHolder.empty().append(self.template.defaultTelPlaceHolder);
          self.$historyEditor.summernote('code', self.template.defaultTelPlaceHolder);
          self.$historyWriteNotice.text('반드시 양식에 맞춰 작성할 것!');
        }
      });

    /**
     * event : historySave
     */
    }else if(event === 'historySave'){
      console.log('View.bind.historySave execute');
      var temp = self.$historyWrite;
      temp.unbind('click').bind('click', function(event){
        var target = event.target;
        if(target.tagName.toLowerCase() === 'button' && $(target).data('type') === 'save'){
          self._getHistoryWriteData(function(data){
            if(data){
              handler(data);
            }
          });
        }else if(target.tagName.toLowerCase() === 'button' && $(target).data('type') === 'close'){
          self.$page.each(function(i,v){
            if($(v).data('page') === 'history-main'){
              $(v).removeClass('hidden');        
            }else{
              $(v).addClass('hidden')
            }
        });
        }
      });

    /**
     * event : show.hospUniqDialog
     */    
    }else if(event === 'show.hospUniqDialog'){
      console.log('View.bind.show.hospUniqDialog execute');
      var temp = self.$uniqDialog;
      temp.unbind('show.bs.modal').bind('show.bs.modal', function(event){        
        if($(this).attr('id') === 'hospital-uniq-dialog'){
          var target = event.relatedTarget;
          var id = $(target).data('id'); 
          var hospnum = $(target).data('hospnum'); 
          if(!id){
            event.preventDefault();
            neoNotify.Show({
              text : '요양기관을 선택해주세요.',
              type : 'error',
              desktop : false
            });    
          }else{
            target = self.$uniqDialog.find('h3#uniq-title');
            target.data({'id': id, 'hospnum' : hospnum});
            $(':input:radio[name="uniq-type"]').prop('checked',false)
            temp.find('select').selectpicker('val', '');
            temp.find('textarea').val('');

            handler()            
          }
        }
      });

    /**
     * event : hospUniqSave
     */    
    }else if(event === 'hospUniqSave'){
      console.log('View.bind.hospUniqSave execute');
      var temp = self.$uniqDialog;
      temp.unbind('click').bind('click', function(_event){
        var target = _event.target;
        if(target.tagName.toLowerCase() === 'button'){
          if(target.dataset.name){
            if(target.dataset.name.toLowerCase() === event.toLowerCase()){
              self._getHospUniqWriteData(function(data){
                if(data){
                  handler(data, $(target));
                }
              });
            }
          }
        }
      });      
    }else if(event === 'historyQuickDate, historySearch'){
      console.log('View.bind.historyQuickDate, historySearch execute');
      var temp = self.$historySearch;
      temp.unbind('click').bind('click', function(event){                
        handler({
          id : $(this).data('id'),
          keyword : self.$historyKeyword.val().trim(),
          start : self.$historyDate.filter('[data-name="start"]').val(),
          end : self.$historyDate.filter('[data-name="end"]').val()
        },self.$historySearch);
      });
      temp = self.$historyQuickDate;
      temp.unbind('click').bind('click', function(event){

        var day = new Date(new Date().GetToday('YYYY-MM-DD'));
        if('y' === $(this).data('name')){          
          day.setDate(day.getDate()-1);
        }
        day = day.GetDate_CustomFormat('YYYY-MM-DD');
        self.$historyDate.each(function(i,v){
          $(v).val(day);
        });
        handler({
          id : $(this).data('id'),
          keyword : self.$historyKeyword.val().trim(),
          start : day,
          end : day
        },self.$historySearch);
      });
      temp = self.$historyKeyword;
      temp.unbind('keyup').bind('keyup', function(event){
        if(event.type == 'keyup' && (event.keyCode == 13 || event.key == 'Enter')){
          handler({
            id : self.$historySearch.data('id'),
            keyword : $(this).val().trim(),
            start : self.$historyDate.filter('[data-name="start"]').val(),
            end : self.$historyDate.filter('[data-name="end"]').val()
          },self.$historySearch);
        }
      });
    }else if(event === 'historyDetail'){
      console.log('View.bind.historyDetail execute');
      self.$historyTable.each(function(i ,v){
        $(v).unbind('click').bind('click', function(_event){
          
          var target = _event.target;
          var parent = $(target).parent();
          if(target.tagName.toLowerCase() === 'td'){
            if(parent.hasClass('has-child')){
              var child = $(parent).data('target');
              child = $('#' + child);              
              child.toggleClass('in');
            }else{
              var selItem = {
                event : event,
                as : i === 2 ? true : false,
                key : (function(){
                  return parent.find('td[data-name="인덱스"]').text();
                })(),
                target : parent,
                type : i
              };
              if(selItem.key){
                handler(selItem);
              }     
            }            
          } else if(target.tagName.toLowerCase() === 'button'){
            if(i < 2){
              parent = parent.parent();
              var writer = (function(){
                    return parent.find('td[data-name="작성자"]').data('value');
                  })();
              
              if($(target).data('type') === 'edit'){
                if(parseInt(writer) !== parseInt(neo.user.USER_ID)){
                  swal(
                    '수정할 수 없습니다.',
                    '글을 작성한 사람만 수정이 가능합니다.',
                    'error'
                  );
                }else{
                  handler({
                    event : 'historyEdit',
                    as : i === 2 ? true : false,                  
                    type : i,
                    key : (function(){
                      return parent.find('td[data-name="인덱스"]').text();
                    })(),
                    'USER_ID' : (function(){
                      return parent.find('td[data-name="USER_ID"]').text();
                    })(),
                    '기관명칭' : (function(){
                      return parent.find('td[data-name="기관명칭"]').text();
                    })(),
                    '기관코드' : (function(){
                      return parent.find('td[data-name="기관코드"]').text();
                    })(),
                    '처리일자' : (function(){
                      return parent.find('td[data-name="처리일자"]').text();
                    })()
                  });     
                }       
              }else{
                if(parseInt(writer) !== parseInt(neo.user.USER_ID)){
                  swal(
                    '삭제할 수 없습니다.',
                    '글을 작성한 사람만 삭제가 가능합니다.',
                    'error'
                  );
                }else{
                  swal({
                    title: '정말로 삭제하시겠습니까?',
                    text: "선택하신 일지를 삭제합니다.",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: '아니오',
                    confirmButtonText: '네, 삭제할께요!'
                  }).then(function () {
                    handler({      
                      event : 'historyRemove',            
                      key : (function(){
                        return parent.find('td[data-name="인덱스"]').text();
                      })(),
                      'USER_ID' : (function(){
                        return parent.find('td[data-name="USER_ID"]').text();
                      })()
                    });
                  });
                }
              }              
            }
          } else if(target.tagName.toLowerCase().match(/li|a/)){   
            var pager = null;        
            if(target.tagName.toLowerCase() === 'li') {
              if($(target).hasClass('disabled')) return;             
              pager = $(target); 
            } else {
              if($($(target).parent()).hasClass('disabled')) return;
              pager = $(target).parent();              
            } 

            
            handler({
              event : 'historyASPage',
              as : true,
              pageType : $(pager).data('type'),
              pages : $(pager).data('pages'),
              curpage : $(pager).data('curpage'),
              pager : pager
            });
          }
        });        
      });   
    
    }
    
  };

  View.prototype.render = function(viewCmd, data){
    var self = this;
    var viewCommands = {
      showHospList : function(){
        console.log('View.render.showHospList execute!');
        self.$hospitalList.empty();
        self._addHospItem(data);
      },
      showHospInfo : function(){
        console.log('View.render.showHospInfo execute!');
        self.$uniqDialog.modal('hide');
        self._loadHospInfo(data);

        if(mobile){
          $(self.$hospitalTabs.eq(1)).tab('show');
        }

      },
      showHistroyWrite : function(){
        console.log('View.render.showHistroyWrite execute');
        self._loadHistoryWritePage(data);
        // if(mobile){
        //   $(self.$hospitalTabs.eq(3)).tab('show');

        // }
      },
      showHospUniqInfo : function(){
        console.log('View.render.showHospUniqInfo execute');
        self._loadHospUniqInfo(data);
      },
      showHospHistoryList : function(){
        console.log('View.render.showHospHistoryList execute');
        
        self.$historyTable.each(function(i,_table){
       
          var $tab = $(self.$historyTabs.eq(i));
          $tab.html($tab.data('name') + ' <span class="badge">'+data[i].length+'</span>');
          // $(_table).parent().addClass('hidden');  
          if(i < 2){
            $(_table).find('tbody').empty().append(self.template.insertHistoryItem(data[i]));
          }else{
            $(_table).find('ul.pager').empty().append(self.template.insertASItemPagination(data[i]));
            $(_table).find('tbody').empty().append(self.template.insertASItem(data[i], 1));
          }
          
        });

      },
      showHistoryASPage : function(){
        console.log('View.render.showHistoryASPage execute');
        var _table = self.$historyTable.eq(2);    
        
        if(data.pageType === 'next'){
          data.page = parseInt(data.curpage) + 1;
          if(parseInt(data.page) === parseInt(data.pages)){
            data.pager.addClass('disabled');
          }
        }else{
          data.page = parseInt(data.curpage) - 1;
          if(parseInt(data.page) === 1){
            data.pager.addClass('disabled');
          }
        }

        data.pager.data('curpage', data.page);
        data.pager.siblings().data('curpage', data.page);
        data.pager.siblings().removeClass('disabled');

        $(_table).find('tbody').empty().append(self.template.insertASItem(data.data, data.page));
      }
    };
    viewCommands[viewCmd]();
  };

  View.prototype._addHospItem = function(data){
    this.$hospitalList.append(this.template.insertHospItem(data));   
    this.$hospitalUniq.removeData('id');
    this.$historySearch.removeData('id');
    this.$historyQuickDate.removeData('id');
  };

  View.prototype._loadHospInfo = function(data){
    var self = this;
    this.$page.each(function(i,v){
      if($(v).data('page') === 'history-main'){
        $(v).removeClass('hidden');        
      }else{
        $(v).addClass('hidden')
      }
    });
    this.$hospitalInfo.toggleClass('fadeIn'); 
    var template = this.template.defaultHospitalInfo;
    template = template.replace('{{기관명칭}}', data['기관명칭']);
    template = template.replace('{{기관코드}}', data['기관코드']);
    template = template.replace('{{프로그램}}', data['프로그램']);
    template = template.replace('{{진료과목}}', data['진료과목']);
    template = template.replace('{{기관대표}}', data['대표자']);
    template = template.replace('{{전화번호}}', data['전화번호']);
    template = template.replace('{{팩스번호}}', data['팩스번호']);
    template = template.replace('{{휴대폰번호}}', data['핸드폰번호']);
    template = template.replace('{{주소}}', '(' + data['우편번호'] +') ' + data['주소']);
    template = template.replace('{{이메일}}', data['이메일']);
    template = template.replace('{{담당자}}', data['담당자']);

    var extras = data['부가서비스'].split(',');
    var extraItems = '';
    extras.forEach(function(_item){
      if(_item){
        var _template = self.template.defaultExtraService;
        _template = _template.replace('{{부가서비스}}', _item);
        extraItems += _template;
      }
    });     
    template = template.replace('{{부가서비스}}', extraItems);
    this.$hospitalInfo.empty().append(template).toggleClass('fadeIn');
    
    this.$hospitalUniqInfo.each(function(i, v){
      var key = $(v).data('id');
      $(v).empty();
      if(data.hasOwnProperty(key)){
        if(key.match(/병원유형/gim)){
          var $span = $('<span />');
          if(parseInt(data[key]) === 0){
            $span.addClass('text-success').text('우수');
          }else if(parseInt(data[key]) === 2){
            $span.addClass('text-danger').text('주의');
          }else{
            $span.text('보통');
          }
          $(v).empty().append($span);
        }else if(key.match(/메모/gim)){
          $(v).html('<pre class="unstyled-pre">'+data[key]+'</pre>');
        }else{
          $(v).text(data[key]);
        }        
      }
    });
    
    this.$hospitalUniqWriteDate.text('수정정보 : ' + ( data['수정일자'] || '') + ' / ' + neo.users.GetUserName(data['수정자']).USER_NAME );

    this.$hospitalUniq.data({'id': data.user_id, 'hospnum' : data['기관코드']});
    this.$historySearch.data('id', data.user_id);
    this.$historyQuickDate.data('id', data.user_id);

  };
  
  View.prototype._loadHospUniqInfo = function(data){
    //
    this.$uniqDialog.find('input#uniq-type-' + data['병원유형']).prop('checked', true);    
    this.$uniqDialog.find('#uniq-computation').val(data['전산담당']);
    this.$uniqDialog.find('#uniq-payer').val(data['결제담당']);
    // if(data['부가서비스']){
    //   this.$uniqDialog.find('#uniq-extra-service').selectpicker('val', data['부가서비스'].split(','));
    // }
    this.$uniqDialog.find('#uniq-memo').val(data['메모']);
  };

  View.prototype._loadHistoryWritePage = function(data){
    var self = this;
    this.$page.each(function(i,v){
      if($(v).data('page') === 'history-write'){
        $(v).removeClass('hidden');

        $(':input:radio[name="history-type"]').prop('checked',false);
        self.$historyEditor.summernote('code', '');

        $(':input:radio[name="history-type"]:eq('+data.type+')').prop('checked',true);
        self.$historyEditor.summernote('code', data.내용);

        $(v).find('h3#history-title').text(data.기관명칭 + ' / ' + data.기관코드);
        self.$historyWrite.data('id', data.USER_ID);
        self.$historyWrite.data('key', data.key);

        if(data.처리일자){
          self.$historyDate.filter('[data-name="work"]').val(data.처리일자);
          self.$historyDate.filter('[data-name="work"]').datepicker('setDate', data.처리일자);
        }else{
          self.$historyDate.filter('[data-name="work"]').datepicker('setDate', (new Date()).GetToday());
        }
      }else{
        $(v).addClass('hidden')
      }
    });

  };

  View.prototype._getHistoryWriteData = function(callback){
    var data = {};
    data.USER_ID = this.$historyWrite.data('id');
    data.key = this.$historyWrite.data('key');
    data.type = $(":input:radio[name=history-type]:checked").val();
    data.writer = neo.user.USER_ID;
    data.workdate = this.$historyDate.filter('[data-name="work"]').val();
    data.contents = this.$historyEditor.summernote('code');
    data['지사코드'] = neo.user.user_area;

    
    if(!data.type){      
      neoNotify.Show({
        text : '일지유형을 선택해주세요.',
        type : 'error',
        desktop : false
      });
      callback(null);
    }

    if(!data.contents){
      neoNotify.Show({
        text : '일지내용을 작성해주세요.',
        type : 'error',
        desktop : false
      });
      callback(null);
    }

    callback(data);

  };

  View.prototype._getHospUniqWriteData = function(callback){
    var data = {
      USER_ID : this.$uniqDialog.find('h3#uniq-title').data('id'),
      hospnum : this.$uniqDialog.find('h3#uniq-title').data('hospnum'),
      type : $(":input:radio[name=uniq-type]:checked").val(),
      computation : $('input#uniq-computation').val(),
      payer : $('input#uniq-payer').val(),
      // extra : $('select#uniq-extra-service').selectpicker('val'),
      memo : $('textarea#uniq-memo').val(),
      writedate : (new Date()).GetToday('YYYY-MM-DD HH:MM:SS'),
      writer : neo.user.USER_ID
    };
  
    data.extra = data.extra ? data.extra.toString() : "";

    callback(data);
  };

  /**
   * Controller Module
   */
  function Controller(model, view){
    console.log('controller');
    this.model = model;
    this.view  = view;
    var self = this;

    this.view.bind('areaAll', function(checked){
      self.model.hospAreaAll = checked;
      self.clearData(function(){
        self.showHospList();
        self.showHospHistoryList();
      });      
    });

    this.view.bind('hospSearch', function(search){
      self.model.hospSearch = search;
      self.model.hospManager = self.view.$hospManager.selectpicker('val');
      
      self.showHospList();
    })

    this.view.bind('hospClick', function(item){
      if(item.hasOwnProperty('id')){
        self.showHospInfo(item.id);
        self.showHospHistoryList(item);
      }else if(item.hasOwnProperty('index')){
        self.model.findItem('hospitalList', item.index, function(_item){
          self.model.storage.setData('hospitalInfo', _item);
          self.view.render('showHistroyWrite',_item);
        });  
      }         
    });

    this.view.bind('historyWriteType', function(){

    });

    this.view.bind('historySave', function(data){
      self.saveHistory(data);
    });

    this.view.bind('show.hospUniqDialog', function(){
      self.view.render('showHospUniqInfo', self.model.storage.getData('hospitalInfo'));
    });

    this.view.bind('hospUniqSave', function(data, loader){
      self.saveHospitalUniqInfo(data, loader);
    });    

    this.view.bind('historyQuickDate, historySearch', function(item, loader){
      self.showHospHistoryList(item, loader);
    });

    this.view.bind('historyDetail', function(item){
      if(item.event === 'historyDetail'){
        self.showHistoryDetail(item);
      }else if(item.event === 'historyEdit'){
        self.showHistoryEditPage(item);
      }else if(item.event === 'historyRemove'){
        self.removeHistory(item);
      }else if(item.event === 'historyASPage'){
        self.historyASPaging(item);
      }
    });

   
    this.view.bind('historyRemove', function(item){
      self.removeHistory(item);
    });

    this.showHospList();
    this.showHospHistoryList();
  }

  Controller.prototype.clearData = function(callback){
    this.model.clearData(callback);
  };

  Controller.prototype.showHospList = function(){
    var self = this;
    this.model.readHosp(function(result){
      if(result.err){
        if(result.err === 'NODATA'){
          self.view.render('showHospList', null);
        }
      }else{
        self.view.render('showHospList', result.data);
      }
    });
  };

  Controller.prototype.showHospInfo = function(id){
    var self = this;
    this.model.readHospInfo(id, function(result){
      if(result.err){

      }else{
        self.view.render('showHospInfo', result.data[0]);
      }
    });
  };

  Controller.prototype.showHospHistoryList = function(item, loader){
    var self = this;

    if(!item){
      item = {
        id : null,
        keyword : self.view.$historyKeyword.val().trim(),
        start : self.view.$historyDate.filter('[data-name="start"]').val(),
        end : self.view.$historyDate.filter('[data-name="end"]').val()        
      };      
    }

    this.model.readHospHistoryList(item, function(result){
      if(result.err){

      }else{
        self.view.render('showHospHistoryList', result.data);        
      }
    }, loader);
  }

  Controller.prototype.saveHistory = function(data){
    var self = this;
    this.model.saveHistory(data, function(result){
      if(result.err){

      }else{
        self.showHospInfo(data.USER_ID);     
        self.showHospHistoryList({
          id : data.USER_ID,
          start : self.view.$historyDate.filter('[data-name="start"]').val(),
          end : self.view.$historyDate.filter('[data-name="end"]').val(),
        });
      }
    });
  };

  Controller.prototype.saveHospitalUniqInfo = function(data, loader){
    var self = this;
    this.model.saveHospitalUniqInfo(data, function(result){
      if(result.err){
        neoNotify.Show({
          text : result.err.message,
          type : 'error',
          desktop : false
        });    
      }else{
        self.showHospInfo(data.USER_ID);
      }
    },loader);
  };

  Controller.prototype.showHistoryDetail = function(item){
    var self = this;
    this.model.getHistoryDetail(item, function(result){
      if(result.err){

      }else{
        result.data[0].내용 = result.data[0].내용.replace(/src="uploads/,'src="/uploads');
        
        
        var parent = item.target;
        parent.data('target', 'history-' + parent.index() + '-' + item.type);
        parent.addClass('has-child');

        var colCount = 0;
        parent.find('td').each(function(i,v){
          // if($(v).is(':visible')){
            colCount += 1;
          // }
        });
        //debugger;
        parent.after(
          '<tr class="collapse in animated fadeInRight" id="'+'history-' + parent.index()+ '-' + item.type + '"> ' + 
          '  <td colspan="' + colCount + '" class="content-preview">' + result.data[0].내용 + '</td>' +
          '</tr>');       

      }
    })
  };

  Controller.prototype.showHistoryEditPage = function(item){
    var self = this;
    this.model.getHistoryDetail(item, function(result){
      if(result.err){

      }else{        
        item['내용'] = result.data[0].내용;
        self.view.render('showHistroyWrite', item);
      }
    });
  };

  Controller.prototype.removeHistory = function(item){
    var self = this;
    this.model.removeHistory(item, function(result){
      if(result.err){

      }else{      
        self.showHospInfo(item.USER_ID);     
        self.showHospHistoryList({
          id : item.USER_ID,
          start : self.view.$historyDate.filter('[data-name="start"]').val(),
          end : self.view.$historyDate.filter('[data-name="end"]').val(),
        });
      }
    });
  };

  Controller.prototype.historyASPaging = function(item){
    item.data = this.model.storage.getData('historyList')[2];
    this.view.render('showHistoryASPage', item);
  };
  
  /**
   * Model Module
   */
  function Model(storage){
    console.log('Model');
    this.storage = storage;
    this.hospAreaAll = false;
    this.hospSearch = '';
    this.hospManager = '';
  }

  Model.prototype.clearData = function(callback){
    this.storage.removeData('hospitalInfo');
    callback();
  };

  Model.prototype.findItem =function(key, index, callback){
    this.storage.findItem(key, index, callback);
  };

  Model.prototype.findItemByID = function(key, id){
    return this.storage.findItemByID(key, id);
  };

  Model.prototype.readHosp = function(_callback){
    var self = this;
    $.ajax({
      url : '/manage/hosplist',
      data : {
        area : this.hospAreaAll ? '' : neo.user.user_area,
        search : this.hospSearch,
        manager : this.hospManager
      },
      dataType : 'json',
      method : 'GET',
      async : true,
      beforeSend : function(){},
      success : function(result){
        _callback(result);
      },
      error : function(a,b,c){
        console.log('ERROR!!!');
        console.log(a,b,c);
      },
      complete : function(result){
        self.storage.setData('hospitalList', result.responseJSON.data);
      }
    });
  };

  Model.prototype.readHospInfo = function(_id, _callback){
    var self = this;
    $.ajax({
      url : '/manage/hospinfo',
      data : {id : _id},
      dataType : 'json',
      method : 'GET',
      async : false,
      beforeSend : function(){},
      success : function(result){
        _callback(result);
      },
      error : function(a,b,c){
        console.log('ERROR!!!');
        console.log(a,b,c);
      },
      complete : function(result){
        self.storage.setData('hospitalInfo', result.responseJSON.data[0]);
      }      
    });
  };

  
  Model.prototype.saveHistory = function(_data, _callback){

    var hosp = this.storage.getData('hospitalInfo');
    _data["기관코드"] = hosp["기관코드"];
    _data["기관명칭"] = hosp["기관명칭"];
    _data["프로그램"] = hosp["프로그램"];
    _data["지사코드"] = hosp["지사코드"];
    
    $.ajax({
      url : '/manage/history',
      data : _data,
      dataType : 'json',
      method : 'POST',
      async : false,
      beforeSend : function(){},
      success : function(result){
        _callback(result);
      },
      error : function(a,b,c){
        console.log('ERROR!!!');
        console.log(a,b,c);
      },
      complete : function(){}
    })
  };

  Model.prototype.removeHistory = function(_data, _callback){
    $.ajax({
      url : '/manage/history',
      data : _data,
      dataType : 'json',
      method : 'PUT',
      async : true,
      beforeSend : function(){},
      success : function(result){
        _callback(result);
      },
      error : function(a,b,c){
        console.log('ERROR!!!');
        console.log(a,b,c);
      },
      complete : function(){}
    });
  };

  Model.prototype.saveHospitalUniqInfo = function(_data, _callback, _loader){
    $.ajax({
      url : '/manage/hospinfo',
      data : _data,
      dataType : 'json',
      method : 'POST',
      async : true,
      beforeSend : function(){
        if(_loader){          
          if(!_loader.find('i').length){
            _loader.prepend('<i class="fa fa-spinner fa-spin"></i> ').addClass('disabled');
          }
        }
      },
      success : function(result){        
        _callback(result)
      },
      error : function(a,b,c){
        console.log('ERROR!!!');
        console.log(a,b,c);
      },
      complete : function(result){
        if(_loader){
          _loader.removeClass('disabled').find('i').remove();
        }
      }
    })
  };

  Model.prototype.readHospHistoryList = function(_item, _callback, _loader){
    var self = this;
    if(_item.id){
      var hosp = this.storage.getData('hospitalInfo');
      _item["기관코드"] = hosp["기관코드"];
    }
    // _item["지사코드"] = neo.user.user_area;
    
    _item['지사코드'] = this.hospAreaAll ? '' : neo.user.user_area;
    $.ajax({
      url : '/manage/history',
      data : _item,
      dataType : 'json',
      method : 'GET',
      async : true,
      beforeSend : function(){
        if(self.storage){        
          self.storage.removeData('historyList');
        }
        if(_loader){          
          if(!_loader.find('i').length){
            _loader.prepend('<i class="fa fa-spinner fa-spin"></i> ').addClass('disabled');
          }
        }
      },
      success : function(result){       
        _callback(result)
      },
      error : function(a,b,c){
        console.log('ERROR!!!');
        console.log(a,b,c);
      },
      complete : function(result){        
        if(self.storage){     
          self.storage.setData('historyList', result.responseJSON.data);
        }
        if(_loader){
          _loader.removeClass('disabled').find('i').remove();
        }
      }
    })
  };

  Model.prototype.getHistoryDetail = function(_item, _callback){
    $.ajax({
      url : '/manage/history/contents',
      data : {
        key : _item.key,
        as : _item.as
      },
      dataType : 'json',
      method : 'GET',
      async : false,
      beforeSend : function(){},
      success : function(result){
        _callback(result);
      },
      error : function(a,b,c){
        console.log('ERROR!!!');
        console.log(a,b,c);
      },
      complete : function(result){

      }
    })
  };
  
  /**
   * Storage Module
   */

  function Storage(){
    console.log('Storage');
    //this.hospList = [];    
    this.selIndex = -1;
  } 

  Storage.prototype.removeData = function(key){
    this[key] = null;
  }  

  Storage.prototype.setData = function(key, value){
    this[key] = value;
  }

  Storage.prototype.getData = function(key){
    this[key] = this[key] || [];
    return this[key];
  }

  Storage.prototype.findItem = function(key, index, callback){
    this[key] = this[key] || [];    
    this.selIndex = index;
    callback(this[key][index]); 
  }

  Storage.prototype.findItemByID = function(key, id){
    this[key] = this[key] || [];
    return this[key].find(function(_item){
      return _item.USER_ID === id;
    });
  }



  exports.manage = exports.manage || {};
  exports.manage.Template = Template;
  exports.manage.View = View;
  exports.manage.Controller = Controller;
  exports.manage.Model = Model;
  exports.manage.Storage = Storage;

  //$.Manage = new Manage();

})(window);
