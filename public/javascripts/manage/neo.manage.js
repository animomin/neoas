(function(exports){
  'use strict';

  /**
   * Template Module
   */
  function Template(){
    console.log('template');
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
    '  <td></td>' +
    '  <td>{{기관코드}}</td>' +
    '  <td>{{기관명칭}}</td>' +
    '  <td>{{프로그램}}</td>' +
    '  <td>{{접수자}}</td>' +
    '  <td>{{접수일자}}</td>' +
    '  <td>{{처리자}}</td>' +
    '  <td>{{서비스상태}}</td>' +
    '  <td>{{내용}}</td>' +
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

    this.historyTableColumns = [];
    this.historyTableColumns.push([
      { 'title' : '', 'style': { 'width': 50, 'maxWidth': 50 },  'breakpoints' : 'xs' },
      { 'name' : '인덱스', 'visible' : false},
      { 'name' : 'USER_ID', 'visible' : false},
      { 'name' : '기관코드', 'title' : '기관기호' },
      { 'name' : '기관명칭', 'title' : '기관명칭' },
      { 'name' : '프로그램', 'title' : '프로그램' },
      { 'name' : '작성자', 'title' : '작성자',
        formatter : function(value){
          console.log(value);
          return neo.users.GetUserName(value).USER_NAME || '';
        } 
      },
      { 'name' : '작성일자', 'title' : '작성일'},
      { 'name' : '내용', 'title' : '내용', 'breakpoints' : 'all'}
    ]);
    this.historyTableColumns.push([
      { 'title' : '', 'style': { 'width': 50, 'maxWidth': 50 },  'breakpoints' : 'xs' },
      { 'name' : '인덱스', 'visible' : false},
      { 'name' : '기관코드', 'title' : '기관기호' },
      { 'name' : '기관명칭', 'title' : '기관명칭' },
      { 'name' : '프로그램', 'title' : '프로그램',
        formatter: function(value) {
            if (value === "" || typeof value === "undefined") value = 0;
            switch (parseInt(value)) {
                case 1:
                    return 'Eplus';
                case 8:
                    return 'MediChart';
                case 20:
                    return 'SENSE'
            }
        } 
      },
      { 'name' : '접수자', 'title' : '접수자' },
      { 'name' : '접수일자', 'title' : '접수일자' },
      { 'name' : '처리자', 'title' : '처리자'},
      { 'name' : '서비스상태', 'title' : '상태',
        formatter: function(value) {
                value = parseInt(value);
                return ASSTATUS.ServiceName(value);
        }
      },
      { 'name' : '내용',  'title' : '내용', 'breakpoints' : 'all' }      
    ]);
  
    // 


  }

  Template.prototype.insertHospItem = function(data){
    console.log('Template.insertHospItem method execute!');
    var view = '';
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
    this.$hospitalTable = this.$hospitalList.parent();    
    // this.$hospitalInfo = $('table.hospital-info tr td');
    this.$hospitalInfo = $('div#hospital-info');
    this.$hospitalUniqInfo = $('table.hospital-info tr td');
    this.$hospitalUniq = $('button[data-target="#hospital-uniq-dialog"]');

    this.$historySearch = $('button#history-search');
    this.$historyQuickDate = $('button.history-quickDate');
    this.$historyTabs = $('a.history-tabs');
    this.$historyDate = $('div.input-daterange input');    
    this.$historyTable = $('table.history-table')    
    
    this.$historyWrite = $('div#history-body');
    
    
    //Pages
    this.$page = $('div.page');
    this.$historyEditor = this.$page.find('textarea.editor');

    //Modls
    this.$uniqDialog = $('div#hospital-uniq-dialog');
    var temp = this.$uniqDialog.find('select.neo-members');

    neo.users.forEach(function(_m){
      temp.append('<option value="'+_m.USER_ID+'">' + _m.USER_NAME + '</option>');
      
    });
    temp.each(function(i,v){
      $(v).selectpicker({
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
          ['para', ['ul', 'ol', 'paragraph']],
          ['picture', ['picture']]],
      lang : 'ko-KR',
      height : 400,
      buttons : {}
    });

    this.$historyDate.each(function(i,v){
      var today = new Date().GetToday('YYYY-MM');
      var lastday = (new Date( today.split('-')[0], today.split('-')[1], 0)).GetDate_CustomFormat('YYYY-MM-DD');
      $(v).val($(v).data('name') === 'start' ?  today + "-01" : lastday);
      $(v).datepicker({
          format : 'yyyy-mm-dd',
          language:'kr',
          startView: 2,
          keyboardNavigation: false,
          forceParse: false,
          autoclose: true,
          todayHighlight: true
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
          if(!id){
            event.preventDefault();
            neoNotify.Show({
              text : '요양기관을 선택해주세요.',
              type : 'error',
              desktop : false
            });    
          }else{
            target = self.$uniqDialog.find('h3#uniq-title');
            target.data('id', id);
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
                  handler(data);
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
          start : self.$historyDate.filter('[data-name="start"]').val(),
          end : self.$historyDate.filter('[data-name="end"]').val()
        })
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
          start : day,
          end : day
        });
      });
    }else if(event === 'historyDetail'){
      console.log('View.bind.historyDetail execute');
      self.$historyTable.each(function(i ,v){
        $(v).unbind('expand.ft.row').bind('expand.ft.row', function(event, ft, row){          
          var selItem = {
            as : i === 2 ? true : false,
            key : null
          };
          var $contents = row.cells.find(function(_cell){
            return _cell.column.name === '내용';
          }).$detail;

          if($contents.find('td').data('load')){
            return;
          }else{
            $contents.find('td').data('load', 'on');
          }

          selItem.target = $contents;
         

          selItem.key = row.cells.find(function(_cell){            
            return _cell.column.name === '인덱스';
          }).value;
          
          handler(selItem);

        });
      });
    }else if(event === 'historyEdit'){
      console.log('View.bind.historyEdit execute');
      self.$historyTable.each(function(i,v){
        if(i < 2){
          $(v).unbind('edit.ft.editing').bind('edit.ft.editing', function(e, ft, row){           

            var writer = row.cells.find(function(_cell){
              return _cell.column.name === '작성자'
            });


            if(parseInt(writer.value) !== parseInt(neo.user.USER_ID)){
              swal(
                '수정할 수 없습니다.',
                '글을 작성한 사람만 수정이 가능합니다.',
                'error'
              );
            }else{
              handler({
                as : i === 2 ? true : false,
                
                type : i,
                key : row.cells.find(function(_cell){
                  return _cell.column.name === '인덱스';
                }).value,
                'USER_ID' : row.cells.find(function(_cell){
                  return _cell.column.name === 'USER_ID';
                }).value,
                '기관명칭' : row.cells.find(function(_cell){
                  return _cell.column.name === '기관명칭';
                }).value,
                '기관코드' : row.cells.find(function(_cell){
                  return _cell.column.name === '기관코드';
                }).value
              });     
            }       
          });
        }
      });
    }else if(event === 'historyRemove'){
      console.log('View.bind.historyRemove execute');
      self.$historyTable.each(function(i,v){
        if(i < 2){
          $(v).unbind('delete.ft.editing').bind('delete.ft.editing', function(e, ft, row){
            var writer = row.cells.find(function(_cell){
              return _cell.column.name === '작성자'
            });


            if(parseInt(writer.value) !== parseInt(neo.user.USER_ID)){
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
                  key : row.cells.find(function(_cell){
                    return _cell.column.name === '인덱스';
                  }).value,
                  'USER_ID' : row.cells.find(function(_cell){
                    return _cell.column.name === 'USER_ID';
                  }).value
                });
              });
            }
          });          
        }
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
      },
      showHistroyWrite : function(){
        console.log('View.render.showHistroyWrite execute');
        self._loadHistoryWritePage(data);
      },
      showHospUniqInfo : function(){
        console.log('View.render.showHospUniqInfo execute');
        self._loadHospUniqInfo(data);
      },
      showHospHistoryList : function(){
        console.log('View.render.showHospHistoryList execute');
        
        self.$historyTable.each(function(i,_table){
          // FooTable.init('#' + $(_item).attr('id'), {
          //   // we only load the column definitions as the row data is loaded through the button clicks
          //   "columns": self.template.getTableColumns(i)
          // });    

          var $tab = $(self.$historyTabs.eq(i));
          $tab.html($tab.data('name') + ' <span class="badge">'+data[i].length+'</span>');
          $(_table).parent().addClass('hidden');  
          $(_table).empty().footable({
            "columns" : self.template.getTableColumns(i),
            "rows" : data[i]
          }).bind({
            "draw.ft.table" : function(){
              // $(_table).removeClass('hidden');
              $(_table).parent().removeClass('hidden');
              $($(_table).find('tfoot')).find('.footable-add').remove();
            }
           
          });
        });

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
        
        }else{
          $(v).text(data[key]);
        }

        
      }
    });
    

    this.$hospitalUniq.data('id', data.user_id);
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
    data.contents = this.$historyEditor.summernote('code');
    data['지사코드'] = neo.user.user_area
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
      type : $(":input:radio[name=uniq-type]:checked").val(),
      computation : $('input#uniq-computation').val(),
      payer : $('input#uniq-payer').val(),
      // extra : $('select#uniq-extra-service').selectpicker('val'),
      memo : $('textarea#uniq-memo').val()
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

    this.view.bind('historySave', function(data){
      self.saveHistory(data);
    });

    this.view.bind('show.hospUniqDialog', function(){
      self.view.render('showHospUniqInfo', self.model.storage.getData('hospitalInfo'));
    });

    this.view.bind('hospUniqSave', function(data){
      self.saveHospitalUniqInfo(data);
    });    

    this.view.bind('historyQuickDate, historySearch', function(item){
      self.showHospHistoryList(item);
    });

    this.view.bind('historyDetail', function(item){
      self.showHistoryDetail(item);
    });

    this.view.bind('historyEdit', function(item){
      self.showHistoryEditPage(item);
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

  Controller.prototype.showHospHistoryList = function(item){
    var self = this;

    if(!item){
      item = {
        id : null,
        start : self.view.$historyDate.filter('[data-name="start"]').val(),
        end : self.view.$historyDate.filter('[data-name="end"]').val()        
      };      
    }
    
    this.model.readHospHistoryList(item, function(result){
      if(result.err){

      }else{
        self.view.render('showHospHistoryList', result.data);        
      }
    });
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

  Controller.prototype.saveHospitalUniqInfo = function(data){
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
    })
  };

  Controller.prototype.showHistoryDetail = function(item){
    var self = this;
    this.model.getHistoryDetail(item, function(result){
      if(result.err){

      }else{
        result.data[0].내용 = result.data[0].내용.replace(/src="uploads/,'src="/uploads');
        item.target.find('td').empty().html(result.data[0].내용);
        // if($('.footable-details.history-table.table').hasClass('hidden')){
        //   $('.footable-details.history-table.table').removeClass('hidden');
        // }
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
  }
  
  /**
   * Model Module
   */
  function Model(storage){
    console.log('Model');
    this.storage = storage;
    this.hospAreaAll = false;
    this.hospSearch = '';
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
        search : this.hospSearch
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

  Model.prototype.saveHospitalUniqInfo = function(_data, _callback){
    $.ajax({
      url : '/manage/hospinfo',
      data : _data,
      dataType : 'json',
      method : 'POST',
      async : true,
      beforeSend : function(){},
      success : function(result){        
        _callback(result)
      },
      error : function(a,b,c){
        console.log('ERROR!!!');
        console.log(a,b,c);
      },
      complete : function(result){}
    })
  };

  Model.prototype.readHospHistoryList = function(_item, _callback){
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
      async : false,
      beforeSend : function(){},
      success : function(result){       
        _callback(result)
      },
      error : function(a,b,c){
        console.log('ERROR!!!');
        console.log(a,b,c);
      },
      complete : function(result){

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
