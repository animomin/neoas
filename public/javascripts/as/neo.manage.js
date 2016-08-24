(function(){

  var NeoManage = function(){

    var _me = this;

    _me.settings = {
      layouts : {},
      init : function(){
        var _this = this;
        $.each(neo.emrs, function(i,v){
          _this.layouts[i] = v.layouts;
        });
      }
    };

    /**
     * 1. 지사별 AS건수
          1.1 미확인, 미완료, 완료
     * 2. 직원별 AS 처리건수
          1.1 미완료, 완료
     * 3. 프로그램 별 AS발생건수
          3.1 프로그램 중 실행파일 AS건수
     * 4. 병원별 AS 요청건수
     */
    _me.rank = {
      month : null,
      total : false,
      area : {
        data : null,
        best : null,
        total : {
          unidentified : 0,
          incomplete : 0,
          complete : 0,
          cancel : 0,
          all : 0
        },
        area : {},
        Load : function(){
          var _this = this;
          var rankDate = new Date();
          neoAJAX.manage.GetRank({
            url : '/manage/area',
            data : {
              month : _me.rank.month || rankDate.getMonth() + 1,
              total : _me.rank.total
            },
            dataType : 'json',
            method : 'GET',
            async : false,
            beforeSend : function(){
              // 지사별 AS건수 AREA LOADING SHOW
            },
            success : function(opts,data){
              if(data.err){
                return neoNotify.Show({
                  text : data.err.message,
                  desktop : false
                });
              }
              _this.data = data.data;
              _this.best = data.data[0];
              _this.data.forEach(function(item){
                _this.total.unidentified += item.미확인;
                _this.total.incomplete +=  item.미완료;
                _this.total.complete +=  item.완료;
                _this.total.cancel += item.취소;

                if(!_this.area[item.지사코드]){
                  _this.area[item.지사코드] = {
                    unidentified : 0,
                    incomplete : 0,
                    complete : 0,
                    cancel : 0
                  };
                }
                _this.area[item.지사코드].unidentified = item.미확인;
                _this.area[item.지사코드].incomplete = item.미완료;
                _this.area[item.지사코드].complete =  item.완료;
                _this.area[item.지사코드].cancel =   item.취소;
              });
              _this.total.all = _this.total.unidentified + _this.total.incomplete + _this.total.complete + _this.total.cancel;
            },
            callback : function(){
              console.log(_this);
            }
          });
        }
      },
      member : {
        data : null,
        best : null,
        chart : [],
        Load : function(){
          var _this = this;
          var rankDate = new Date();
          neoAJAX.manage.GetRank({
            url : '/manage/member',
            data : {
              month : _me.rank.month || rankDate.getMonth() + 1
            },
            dataType : 'json',
            method : 'GET',
            async : false,
            beforeSend : function(){
              // 직원별 AS건수 AREA LOADING SHOW
            },
            success : function(opts,data){
              if(data.err){
                return neoNotify.Show({
                  text : data.err.message,
                  desktop : false
                });
              }
              _this.data = data.data;
              _this.best = _this.data[0];
            },
            callback : function(){
              console.log(_this);
            }
          });
        }
      },
      hosp : {
        data : null,
        best : null,
        Load : function(){
          var _this = this;
          var rankDate = new Date();
          neoAJAX.manage.GetRank({
            url : '/manage/hosp',
            data : {
              month : _me.rank.month || rankDate.getMonth() + 1
            },
            dataType : 'json',
            method : 'GET',
            async : false,
            beforeSend : function(){
              // 직원별 AS건수 AREA LOADING SHOW
            },
            success : function(opts,data){
              if(data.err){
                return neoNotify.Show({
                  text : data.err.message,
                  desktop : false
                });
              }
              _this.data = data.data;
              _this.best = _this.data[_this.data.length - 1];
            },
            callback : function(){
              console.log(_this);
            }
          });
        }
      },
      emr : {
        emrData : null,
        exeData : null,
        best : null,
        Load : function(){
          var _this = this;
          var rankDate = new Date();
          neoAJAX.manage.GetRank({
            url : '/manage/emr',
            data : {
              month : _me.rank.month || rankDate.getMonth() + 1
            },
            dataType : 'json',
            method : 'GET',
            async : false,
            beforeSend : function(){
              // 직원별 AS건수 AREA LOADING SHOW
            },
            success : function(opts,data){
              if(data.err){
                return neoNotify.Show({
                  text : data.err.message,
                  desktop : false
                });
              }
              _this.emrData = data.data[0];
              _this.exeData = data.data[1];
              _this.best = _this.emrData[_this.emrData.length - 1];
              //_this.best = _this.data[0];
            },
            callback : function(){
              console.log(_this);
            }
          });
        }
      },
      init : function(){
        var _this = this;
        _this.month = (new Date()).getMonth() + 1;
        _this.area.Load();
        _this.member.Load();
        _this.hosp.Load();
        _this.emr.Load();
        _this.Load();
      },
      Load : function(tab){
        var _this = _me.rank;

        $('[data-name="month"]').text(_this.month + '월');
        // switch (tab) {
        //   case '#best':
            $('[data-name="전체요청"]').text(_this.area.total.all);
            $('[data-name="미확인"]').text(_this.area.total.unidentified);
            $('[data-name="미완료"]').text(_this.area.total.incomplete);
            $('[data-name="완료"]').text(_this.area.total.complete);
            $('[data-name="취소"]').text(_this.area.total.cancel);
            var d = _this.member.best;
            $('[data-name="best_member"]').text(neo.area[d.처리자지사 + ""] + " " + d.처리자);
            $('[data-name="best_member_complete"]').text(d.완료 + '건 완료');
            d = _this.area.best;
            $('[data-name="best_area"]').text(neo.area[d.지사코드 + ""]);
            $('[data-name="best_area_complete"]').text(d.완료 + '건 완료');
            d = _this.emr.best;
            $('[data-name="best_emr"]').text(neo.emrs[d.프로그램].name);
            $('[data-name="best_emr_accept"]').text(d.발생건수 + '건 접수');
            d = _this.hosp.best;
            $('[data-name="best_hosp"]').text(d.기관명칭);
            $('[data-name="best_hosp_accept"]').text(d.요청건수 + '건 접수');
          //   break;
          // case '#area':
            var areaCode = Object.keys(_this.area.area);
            var areaName = areaCode.map(function(item){
              return neo.area[item+''];
            });
            var areaDataSet = [
              {
                label : '미확인',
                backgroundColor: "rgba(237, 85, 101, 0.5)",
                borderColor : "rgba(237, 85, 101,1)",
                borderWidth : 1,
                data :  areaCode.map(function(item){
                          return _this.area.area[item+''].unidentified;
                        })
              },
              {
                label : '미완료',
                backgroundColor: "rgba(248,172,89,0.5)",
                borderColor : "rgba(248,172,89,1)",
                borderWidth : 1,
                data :  areaCode.map(function(item){
                          return _this.area.area[item+''].incomplete;
                        })
              },
              {
                label : '완료',
                backgroundColor: "rgba(28,132,198,0.5)",
                borderColor : "rgba(28,132,198,1)",
                borderWidth : 1,
                data :  areaCode.map(function(item){
                          return _this.area.area[item+''].complete;
                        })
              },
              {
                label : '취소',
                backgroundColor: "rgba(35,198,200,0.5)",
                borderColor : "rgba(35,198,200,1)",
                borderWidth : 1,
                data :  areaCode.map(function(item){
                          return _this.area.area[item+''].cancel;
                        })
              },
            ];
            var barData = {
                labels: areaName,
                datasets: areaDataSet,
            };

            var barOptions = {
                scaleBeginAtZero: true,
                scaleShowGridLines: true,
                scaleGridLineColor: "rgba(0,0,0,.05)",
                scaleGridLineWidth: 1,
                barShowStroke: true,
                barStrokeWidth: 2,
                barValueSpacing: 5,
                barDatasetSpacing: 1,
                responsive: true
            };


            var ctx = document.getElementById("barChart_area").getContext("2d");

            $('a.rank-tabs[href="#area"]').on('shown.bs.tab', function (e) {
                var myNewChart = new Chart(ctx,{
                  type : 'bar',
                  data : barData,
                  options : barOptions
                });
            });

        //     break;
        //   default:
        //
        // }
      }
    };

    _me.elem = {
      $tabs : {},
      init : function(){
        var _this = this;
        _this.$tabs = $('a.rank-tabs');

        return _this.initEvents();
      },
      initEvents : function(){
        // var _this = this;
        // _this.$tabs.each(function(i,v){
        //   $(v).bind('show.bs.tab', _me.events.onRankTabClick);
        // });
      }
    };

    _me.events = {
      onRankTabClick : function(e){
        // $(this).attr('href'));
      }
    };

    _me.Initialize = function(callback){
      _me.settings.init();
      _me.rank.init();
      _me.elem.init();
      return callback();
    };

    _me.Initialize(function(){
      var height = $(window).height() - 110;
      $('.tabs-container').height(height);
      $('a.rank-tabs:eq(0)').tab('show');
    });

  };

  // NeoAS();
  $.neoMNG = NeoManage;

})(window);
