var neoNotify = {
  options : {
    title : "NeoSoftBank A/S",
    text : "알림메세지",
    type : "",
    desktop : false,
    progress : false
  },
  Show : function(options, callback){
    var _this = this;
    var _title = options.title || $('title').text();
    _this.options = options;
    _this.options.title = _title;

    PNotify.prototype.options.styling = "fontawesome";

    if(_this.options.desktop){
      PNotify.desktop.permission();
      _ShowDesktopNotify();
    }

    if(_this.options.notiType){
      if(_this.options.notiType === 'confirm'){
        return _ShowConfirmNotify();
      }
    }


    _ShowNotify();

    function _ShowNotify(){
      new PNotify({
        title : _this.options.title,
        text : _this.options.text,
        type : _this.options.type,
        animate : {
          animate : true,
          in_class : 'slideInLeft',
          out_class : 'slideOutRight'
        }
      });
    }

    function _ShowDesktopNotify(){
      (new PNotify({
        title : _this.options.title,
        text : _this.options.text,
        type : _this.options.type,
        desktop : {
          desktop : true
        }
      })).get().click(function(e){

      });
    }

    function _ShowConfirmNotify(){
      (new PNotify({
          title: _this.options.title,
          text: _this.options.text,
          icon: 'fa fa-question',
          hide: _this.options.hide,
          confirm: _this.options.confirm,
          buttons: _this.options.buttons,
          history: _this.options.history,
          addclass: _this.options.addClass,
          stack: _this.options.stack,
          cornerclass : _this.options.cornerclass || "",
          width : _this.options.width || '300px',
      })).get().on('pnotify.confirm', function(){
          callback(true);
      }).on('pnotify.cancel', function(){
          callback(false);
      });
    }


  }

};
