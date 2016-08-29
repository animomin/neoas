(function(){

  var NeoManage = function(){

    var _me = this;
    var _NODATA = '결과없음';

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
      total : 0,    // 0 : false ; 1 : true
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

          neoAJAX.manage.GetRank({
            url : '/manage/area',
            data : {
              month : _me.rank.month,
              total : _me.rank.total
            },
            dataType : 'json',
            method : 'GET',
            async : false,
            beforeSend : function(){
              // 지사별 AS건수 AREA LOADING SHOW
              _this.area = {};
              _this.data = null;
              _this.best = null;
              _this.total = {
                unidentified : 0,
                incomplete : 0,
                complete : 0,
                cancel : 0,
                all : 0
              };

            },
            success : function(opts,data){
              if(data.err){
                return neoNotify.Show({
                  title : '지사별 AS처리현황',
                  text : data.err === 'NODATA' ? _NODATA : data.err.message,
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
        Load : function(){
          var _this = this;

          neoAJAX.manage.GetRank({
            url : '/manage/member',
            data : {
              month : _me.rank.month,
              total : _me.rank.total
            },
            dataType : 'json',
            method : 'GET',
            async : false,
            beforeSend : function(){
              // 직원별 AS건수 AREA LOADING SHOW
              _this.data = null;
              _this.best = null;
            },
            success : function(opts,data){
              if(data.err){
                return neoNotify.Show({
                  title : '직원별 AS처리현황',
                  text : data.err === 'NODATA' ? _NODATA : data.err.message,
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

          neoAJAX.manage.GetRank({
            url : '/manage/hosp',
            data : {
              month : _me.rank.month,
              total : _me.rank.total
            },
            dataType : 'json',
            method : 'GET',
            async : false,
            beforeSend : function(){
              // 직원별 AS건수 AREA LOADING SHOW
              _this.data = null;
              _this.best = null;
            },
            success : function(opts,data){
              if(data.err){
                return neoNotify.Show({
                  title : '병원별 AS접수현황',
                  text : data.err === 'NODATA' ? _NODATA : data.err.message,
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

          neoAJAX.manage.GetRank({
            url : '/manage/emr',
            data : {
              month : _me.rank.month,
              total : _me.rank.total
            },
            dataType : 'json',
            method : 'GET',
            async : false,
            beforeSend : function(){
              // 직원별 AS건수 AREA LOADING SHOW
              _this.emrData = null;
              _this.exeData = null;
              _this.best = null;
            },
            success : function(opts,data){
              if(data.err){
                return neoNotify.Show({
                  title : '프로그램별 AS발생현황',
                  text : data.err === 'NODATA' ? _NODATA : data.err.message,
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
        _this.month =   _this.month || (new Date()).GetToday('YYYY-MM');
        _this.area.Load();
        _this.member.Load();
        _this.hosp.Load();
        _this.emr.Load();
        _this.Load();
      },
      Load : function(tab){
        var _this = _me.rank;

        $('[data-name="month"]').text(' ' + _this.month.replace('-', '년 ') + '월');

        //BEST
        // $('a.rank-tabs[href="#best"]').on('shown.bs.tab', function (e) {
          $('[data-name="전체요청"]').text(_this.area.total.all);
          $('[data-name="미확인"]').text(_this.area.total.unidentified);
          $('[data-name="미완료"]').text(_this.area.total.incomplete);
          $('[data-name="완료"]').text(_this.area.total.complete);
          $('[data-name="취소"]').text(_this.area.total.cancel);
          var d = _this.member.best;
          if(d){
            $('[data-name="best_member"]').text(neo.area[d.처리자지사 + ""] + " " + d.처리자);
            $('[data-name="best_member_complete"]').text(d.완료 + '건 완료');
          }else{
            $('[data-name="best_member"]').text(_NODATA);
            $('[data-name="best_member_complete"]').text(_NODATA);
          }
          d = _this.area.best;
          if(d){
            $('[data-name="best_area"]').text(neo.area[d.지사코드 + ""]);
            $('[data-name="best_area_complete"]').text(d.완료 + '건 완료');
          }else{
            $('[data-name="best_area"]').text(_NODATA);
            $('[data-name="best_area_complete"]').text(_NODATA);
          }

          d = _this.emr.best;
          if(d){
            $('[data-name="best_emr"]').text(neo.emrs[d.프로그램].name);
            $('[data-name="best_emr_accept"]').text(d.발생건수 + '건 접수');
          }else{
            $('[data-name="best_emr"]').text(_NODATA);
            $('[data-name="best_emr_accept"]').text(_NODATA);
          }
          d = _this.hosp.best;
          if(d){
            $('[data-name="best_hosp"]').text(d.기관명칭);
            $('[data-name="best_hosp_accept"]').text(d.요청건수 + '건 접수');
          }else{
            $('[data-name="best_hosp"]').text(_NODATA);
            $('[data-name="best_hosp_accept"]').text(_NODATA);
          }
        // });

        //지사별 처리현황
        $('a.rank-tabs[href="#area"]').on('shown.bs.tab', function (e) {
            var areaCode = Object.keys(_this.area.area);
            var ctx = document.getElementById("barChart_area").getContext("2d");
            var myNewChart = new Chart(ctx,{
              type : 'bar',
              data : {
                  labels: areaCode.map(function(item){return neo.area[item+''];}),
                  datasets: [
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
                      label : '미완료',
                      backgroundColor: "rgba(248,172,89,0.5)",
                      borderColor : "rgba(248,172,89,1)",
                      borderWidth : 1,
                      data :  areaCode.map(function(item){
                                return _this.area.area[item+''].incomplete;
                              })
                    },
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
                      label : '취소',
                      backgroundColor: "rgba(35,198,200,0.5)",
                      borderColor : "rgba(35,198,200,1)",
                      borderWidth : 1,
                      data :  areaCode.map(function(item){
                                return _this.area.area[item+''].cancel;
                              })
                    }
                  ]
              },
              options : {
                  scaleBeginAtZero: true,
                  scaleShowGridLines: true,
                  scaleGridLineColor: "rgba(0,0,0,.05)",
                  scaleGridLineWidth: 1,
                  barShowStroke: true,
                  barStrokeWidth: 2,
                  barValueSpacing: 5,
                  barDatasetSpacing: 1,
                  responsive: true
              }
            });
        });

        //직원별 처리현황
        $('a.rank-tabs[href="#member"]').on('shown.bs.tab', function(e){
            if(!_this.member.data) return false;
            var ctx = document.getElementById('barChart_member').getContext('2d');
            var myNewChart = new Chart(ctx, {
              type : 'bar',
              data : {
                labels : _this.member.data.map(function(item){return item.처리자;}),
                datasets : [
                  {
                    label : '완료',
                    backgroundColor: "rgba(28,132,198,0.5)",
                    borderColor : "rgba(28,132,198,1)",
                    borderWidth : 1,
                    data :  _this.member.data.map(function(item){return item.완료;})
                  },
                  {
                    label : '미완료',
                    backgroundColor: "rgba(248,172,89,0.5)",
                    borderColor : "rgba(248,172,89,1)",
                    borderWidth : 1,
                    data :  _this.member.data.map(function(item){return item.미완료;})
                  },
                  {
                    label : '취소',
                    backgroundColor: "rgba(35,198,200,0.5)",
                    borderColor : "rgba(35,198,200,1)",
                    borderWidth : 1,
                    data :  _this.member.data.map(function(item){return item.취소;})
                  }
                ]
              },
              options : {
                scaleBeginAtZero: true,
                scaleShowGridLines: true,
                scaleGridLineColor: "rgba(0,0,0,.05)",
                scaleGridLineWidth: 1,
                barShowStroke: true,
                barStrokeWidth: 2,
                barValueSpacing: 5,
                barDatasetSpacing: 1,
                responsive: true
              }
            });
        });

        // 프로그램별
        $('a.rank-tabs[href="#emr"]').on('shown.bs.tab', function(e){
            if(!_this.emr.emrData) return false;
            var ctx = document.getElementById('pieChart_emr').getContext('2d');
            var myNewChart = new Chart(ctx, {
              type : 'pie',
              data : {
                labels : _this.emr.emrData.map(function(item){return neo.emrs[item.프로그램].name;}),
                datasets : [
                  {
                    data : _this.emr.emrData.map(function(item){return item.발생건수;}),
                    backgroundColor : _this.emr.emrData.map(function(item){return neo.emrs[item.프로그램].chart.backgroundColor;}),
                    hoverbackgroundColor : _this.emr.emrData.map(function(item){return neo.emrs[item.프로그램].chart.hoverbackgroundColor;}),
                    borderColor : _this.emr.emrData.map(function(item){return neo.emrs[item.프로그램].chart.borderColor;}),
                    borderWidth : _this.emr.emrData.map(function(item){return neo.emrs[item.프로그램].chart.borderWidth;})
                  }
                ]
              },
              options : {
                animateScale : true,
                title: {
                    display: true,
                    text: '프로그램별 AS발생건수',
                    position: 'bottom',
                    fontSize : 18
                },
                onClick : function(e, emrItem){
                  var emr = null;
                  $.each(neo.emrs, function(i,v) {
                    if (v.name.toUpperCase() === emrItem[0]._view.label.toUpperCase()){
                      emr = v;
                      return true;
                    }
                  });
                  var ctx2 = document.getElementById('radarChart_emr').getContext('2d');
                  var myNewChart2 = new Chart(ctx2, {
                    type : 'radar',
                    data : {
                      labels : _this.emr.exeData.map(function(item){
                        if(item.프로그램 === emr.id){
                          return item.실행파일;
                        }
                      }),
                      datasets: [
                        {
                          label: "발생건수",
                          backgroundColor: "rgba(255,99,132,0.2)",
                          borderColor: "rgba(255,99,132,1)",
                          pointBackgroundColor: "rgba(255,99,132,1)",
                          pointBorderColor: "#fff",
                          pointHoverBackgroundColor: "#fff",
                          pointHoverBorderColor: "rgba(255,99,132,1)",
                          data: _this.emr.exeData.map(function(item){
                            if(item.프로그램 === emr.id){
                              return item.발생건수;
                            }
                          })
                        }
                      ],
                      options: {
                        title: {
                            display: true,
                            text: '실행화일별 AS발생건수',
                            position: 'bottom',
                            fontSize : 18
                        },
                        scale: {
                            reverse: true,
                            ticks: {
                                beginAtZero: true
                            }
                        }
                      }
                    }
                  });
                }
              }
            });
        });

        // 병원별
        $('a.rank-tabs[href="#hosp"]').on('shown.bs.tab', function(e){
            if(!_this.hosp.data) return false;
            var ctx = document.getElementById('barChart_hosp').getContext('2d');
            var myNewChart = new Chart(ctx, {
              type : 'bar',
              data : {
                labels : _this.hosp.data.map(function(item){return item.기관명칭 + '('+item.기관코드+')';}),
                datasets : [
                  {
                    label : '전체',
                    backgroundColor: "rgba(122, 122, 122, 0.5)",
                    borderColor : "rgba(122, 122, 122,1)",
                    borderWidth : 1,
                    data :  _this.hosp.data.map(function(item){return item.요청건수;})
                  },
                  {
                    label : '완료',
                    backgroundColor: "rgba(28,132,198,0.5)",
                    borderColor : "rgba(28,132,198,1)",
                    borderWidth : 1,
                    data :  _this.hosp.data.map(function(item){return item.완료;})
                  },
                  {
                    label : '미완료',
                    backgroundColor: "rgba(248,172,89,0.5)",
                    borderColor : "rgba(248,172,89,1)",
                    borderWidth : 1,
                    data :  _this.hosp.data.map(function(item){return item.미완료;})
                  },
                  {
                    label : '미확인',
                    backgroundColor: "rgba(237, 85, 101, 0.5)",
                    borderColor : "rgba(237, 85, 101,1)",
                    borderWidth : 1,
                    data :  _this.hosp.data.map(function(item){return item.미확인;})
                  },
                  {
                    label : '취소',
                    backgroundColor: "rgba(35,198,200,0.5)",
                    borderColor : "rgba(35,198,200,1)",
                    borderWidth : 1,
                    data :  _this.hosp.data.map(function(item){return item.취소;})
                  }
                ]
              },
              options : {
                scaleBeginAtZero: true,
                scaleShowGridLines: true,
                scaleGridLineColor: "rgba(0,0,0,.05)",
                scaleGridLineWidth: 1,
                barShowStroke: true,
                barStrokeWidth: 2,
                barValueSpacing: 5,
                barDatasetSpacing: 1,
                responsive: true
              }
            });
        });
      }
    };

    _me.elem = {
      $rankTabs : null,
      $rankDate : null,
      init : function(){
        var _this = this;
        _this.$rankTabs = $('a.rank-tabs');
        _this.$rankDate = $('input#rankMonth');
        _this.$rankDate.val(_me.rank.month.replace('-', '년 ') + '월');
        $('.input-group.date').datepicker({
            format : 'yyyy년 mm월',
            language:'kr',
            minViewMode: 1,
            keyboardNavigation: false,
            forceParse: false,
            autoclose: true,
            todayHighlight: true
        });
        return _this.initEvents();
      },
      initEvents : function(){
        var _this = this;
        _this.$rankDate.bind('change', _me.events.onMonthPick);
      }
    };

    _me.events = {
      onRankTabClick : function(e){
        // $(this).attr('href'));
      },
      onMonthPick : function(e){
        _me.rank.month = $(this).val();
        _me.rank.month = _me.rank.month.replace('년 ', '-');
        _me.rank.month = _me.rank.month.replace('월','');
        _me.rank.init();
        $('a.rank-tabs:eq(0)').tab('show');
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
