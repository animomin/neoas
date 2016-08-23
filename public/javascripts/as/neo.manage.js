(function(){

  var NeoManage = function(){

    var _me = this;

    _me.settings = {
      layouts : {},
      init : function(){
        this.layouts = neo.settings.layouts;
      }
    };


    _me.Initialize(function(){

    });

  };

  // NeoAS();
  $.neoMNG = NeoManage;

})(window);
