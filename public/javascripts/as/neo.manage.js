(function () {

  var VIEWMODE = {
    AREA: 0,
    MY: 1
  };
  var _NODATA = '결과없음';

  var chartOptions = {
    scaleBeginAtZero: true,
    scaleShowGridLines: true,
    scaleGridLineColor: "rgba(0,0,0,.05)",
    scaleGridLineWidth: 1,
    barShowStroke: true,
    barStrokeWidth: 2,
    barValueSpacing: 5,
    barDatasetSpacing: 1,
    responsive: true,
    events: false,
    tooltips: { enabled: false },
    hover: { animationDuration: 0 },
    animation: {
      duration: 1,
      onComplete: function () {
        var chartInstance = this.chart,
          ctx = chartInstance.ctx;
        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = 'darkgray';

        this.data.datasets.forEach(function (dataset, i) {
          var meta = chartInstance.controller.getDatasetMeta(i);
          meta.data.forEach(function (bar, index) {
            data = dataset.data[index];
            ctx.fillText(data, bar._model.x, bar._model.y - 5);
          });
        });
      }
    }
  };
  var tableColumn = [
    { 'name': '인덱스', 'title': 'ID', 'style': { 'width': 50, 'maxWidth': 50 }, 'breakpoints': 'xs' },
    { 'name': '기관코드', 'title': '기관번호' },
    {
      'name': '기관명칭', 'title': '기관명칭',
      formatter: function (value) {
        if (value.length > 10) {
          return '<a data-toggle="tooltips" title="' + value + '">' + value.substring(0, 10) + '...</a>';
        } else {
          return value;
        }
      }
    },
    {
      'name': '프로그램',
      'title': 'EMR',
      formatter: function (value) {
        if (value === "" || typeof value === "undefined") value = 0;
        switch (parseInt(value)) {
          case 1:
            return "<span class='badge badge-eplus'>Eplus</span>";
          case 8:
            return "<span class='badge badge-medi'>메디</span>";
          case 20:
            return "<span class='badge badge-sense'>센스</span>";
        }
      }
    },
    {
      'name': '본사AS', 'title': '본사AS', "filterable": false,
      formatter: function (value) {
        switch (parseInt(value)) {
          case 0:
            return "<i class='fa fa-square-o'></i>";
          case 1:
            return "<i class='fa fa-check-square-o'></i>";
          default:
        }
      }
    },
    {
      'name': '응급여부', 'title': '응급', "filterable": false,
      formatter: function (value) {
        switch (parseInt(value)) {
          case 0:
            return "<i class='fa fa-square-o'></i>";
          case 1:
            return "<i class='fa fa-check-square-o'></i>";
          default:
        }
      }
    },
    {
      'name': '수수료', 'title': '수수료', "filterable": false,
      formatter: function (value) {
        switch (parseInt(value)) {
          case 0:
            return "<i class='fa fa-square-o'></i>";
          case 1:
            return "<i class='fa fa-check-square-o'></i>";
          default:
        }
      }
    },
    {
      'name': '지사코드',
      'title': '담당지사',
      formatter: function (value) {
        if (value === '' || typeof value === 'undefined') value = '0000';
        return neo.area[value];
      },
      'breakpoints': 'xs'
    },
    {
      'name': '담당자',
      'title': '담당자',
      formatter: function (value) {
        switch (parseInt(value)) {
          case 0:
            return '미정';
          default:
            return neo.users.GetUserName(value).USER_NAME;
        }
      }
    },
    {
      'name': '서비스상태',
      'title': '상태',
      formatter: function (value) {
        value = parseInt(value);
        return ASSTATUS.ServiceName(value);
      },
      'breakpoints': 'xs'
    },
    {
      'name': '접수자', 'title': '접수자', 'breakpoints': 'md sm xs',
      formatter: function (value) {
        if (value.length > 3) {
          return '<a data-toggle="tooltips" title="' + value + '">' + value.substring(0, 3) + '...</a>';
        } else {
          return value;
        }
      }
    },
    {
      'name': '접수일자', 'title': '접수일', 'type': 'date', 'formatString': 'YYYY-MM-DD', 'breakpoints': 'md sm xs',
      formatter: function (value) {
        if (value === '' || typeof value === 'undefined') return '';
        // var temp = value.format('YYYY-MM-DD');//value.split(' ');
        // return temp[0];
        return value.format('YYYY-MM-DD');
      }
    },
    { 'name': '확인자', 'title': '확인자', 'breakpoints': 'md sm xs' },
    {
      'name': '확인일자', 'title': '확인일', 'type': 'date', 'formatString': 'YYYY-MM-DD', 'breakpoints': 'md sm xs',
      formatter: function (value) {
        if (value === '' || typeof value === 'undefined') return '';
        // var temp = value.format('YYYY-MM-DD');//value.split(' ');
        // return temp[0];
        return value.format('YYYY-MM-DD');
      }
    },
    { 'name': '인계자', 'title': '인계자', 'breakpoints': 'md sm xs' },
    {
      'name': '인계일자', 'title': '인계일', 'type': 'date', 'formatString': 'YYYY-MM-DD', 'breakpoints': 'md sm xs',
      formatter: function (value) {
        if (value === '' || typeof value === 'undefined') return '';
        // var temp = value.format('YYYY-MM-DD');//value.split(' ');
        // return temp[0];
        return value.format('YYYY-MM-DD');
      }
    },
    { 'name': '처리자', 'title': '처리자', 'breakpoints': 'md sm xs' },
    {
      'name': '처리일자', 'title': '처리일', 'type': 'date', 'formatString': 'YYYY-MM-DD', 'breakpoints': 'md sm xs',
      formatter: function (value) {
        if (value === '' || typeof value === 'undefined') return '';
        // var temp = value.format('YYYY-MM-DD');//value.split(' ');
        // return temp[0];
        return value.format('YYYY-MM-DD');
      }
    },
    { 'name': '출력', 'title': '', 'breakpoints': 'all' },
    { 'name': '문의내용', 'title': '내용', 'breakpoints': 'all' }

  ];
  var NeoManage = function (menu) {
    var _menu = parseInt(menu);
    var _me = this;

    var manage = null;
    if (_menu === MENU.MANAGE_STATUS) {
      manage = new AsHistory();
    } else if (_menu === MENU.MANAGE_STATISTIC) {
      manage = new AsRank();
      manage.Init(manage, function () {
        manage.Load();
      });
    }



    // _me.Initialize = function(callback){
    //   _me.settings.init();
    //   _me.rank.init();
    //   _me.elem.init();
    //   return callback();
    // };
    //
    // _me.Initialize(function(){
    //   var height = $(window).height() - 110;
    //   $('.tabs-container').height(height);
    //   $('a.rank-tabs:eq(0)').tab('show');
    // });

  };

  function AsRank() {
    var _this = this;
    this.options.month = (new Date()).GetToday('YYYY-MM');
    this.options.day = (new Date()).GetToday('YYYY-MM-DD');
    var elem = this.elem;
    elem.$month = $('input#rankMonth');
    elem.$day = $('input#rankDay');
    elem.$canvas = $('canvas');
    elem.$table = $('tbody');
    elem.$download = $('button.rank-download');

    elem.$month.val(this.options.month.replace('-', '년 ') + '월');
    elem.$month.datepicker({
      format: 'yyyy년 mm월',
      language: 'kr',
      minViewMode: 1,
      keyboardNavigation: false,
      forceParse: false,
      autoclose: true,
      todayHighlight: true
    }).bind('hide', function (e) {
      selDate = new Date($(this).datepicker('getDate'));
      _this.events.onMonthPick(selDate, _this);
    });

    elem.$day.val(new Date().GetToday('YYYY년 MM월 DD일'));
    elem.$day.datepicker({
      format: 'yyyy년 mm월 dd일',
      language: 'kr',
      keyboardNavigation: false,
      forceParse: false,
      autoclose: true,
      todayHighlight: true
    }).bind('hide', function (e) {
      selDate = new Date($(this).datepicker('getDate'));
      _this.events.onDayPick(selDate, _this);
    });

    elem.$download.bind('click', function (e) {
      selDate = new Date(elem.$month.datepicker('getDate'));
      _this.events.onDownload(selDate, _this, $(this));
    });

  }
  AsRank.prototype = {
    /* DOM elements */
    elem: {
      $month: null,
      $day: null,
      $canvas: null,
      $table: null
    },

    /* DOM Events */
    events: {
      onMonthPick: function (selDate, _this) {
        _this.options.month = selDate.GetDate_CustomFormat("YYYY-MM");
        _this.Load();
      },
      onDayPick: function (selDate, _this) {
        _this.options.day = selDate.GetDate_CustomFormat("YYYY-MM-DD");
        _this.member.Load_Day(_this.options);
      },
      onDownload: function (selDate, _this, $btn) {
        var type = $btn.data('type');
        _this.Download(type, selDate.GetDate_CustomFormat("YYYY-MM"));
      }
    },

    /* Search */
    options: {
      month: null,
      day: null
    },

    company: {
      data: null,
      Load: function (opt) {
        var _this = this;
        neoAJAX.GetAjax({
          url: '/rank/total',
          data: {
            month: opt.month
          },
          dataType: 'json',
          method: 'GET',
          async: false,
          beforeSend: function () {
            _this.data = null;
            $('h1.total_as').text('0 건');
          },
          success: function (opts, data) {
            if (data.err) {
              return neoNotify.Show({
                title: '전체 A/S처리현황',
                text: data.err === 'NODATA' ? _NODATA : data.err.message,
                desktop: false
              });
            }
            _this.data = data.data[0];

          },
          callback: function () {
            if (!_this.data) return false;
            $('h1.total_as').each(function (i, v) {
              $(v).text(
                _this.data[$(v).data('kind')] + ' 건'
              );
            });
          }
        });
      }
    },

    area: {
      data: null,
      area: null,
      Load: function (opt) {
        var _this = this;

        neoAJAX.GetAjax({
          url: '/rank/area',
          data: {
            month: opt.month
          },
          dataType: 'json',
          method: 'GET',
          async: false,
          beforeSend: function () {
            // 지사별 AS건수 AREA LOADING SHOW
            _this.area = {};
            _this.data = null;
            if (window.areaAllChart) {
              window.areaAllChart.destroy();
              window.areaTakeoverChart.destroy();
              window.areaTakeoverTable.empty();
            }
            $('span#area_all_total').text('0건');
          },
          success: function (opts, data) {
            if (data.err) {
              return neoNotify.Show({
                title: '지사별 A/S처리현황',
                text: data.err === 'NODATA' ? _NODATA : data.err.message,
                desktop: false
              });
            }
            _this.data = data.data;
            var count = 0;
            _this.data.forEach(function (item) {

              if (!_this.area[item.지사코드]) {
                _this.area[item.지사코드] = {
                  unidentified: 0,
                  incomplete: 0,
                  complete: 0,
                  cancel: 0,
                  takeover: 0,
                  emergency: 0
                };
              }
              _this.area[item.지사코드].unidentified = item.미확인;
              _this.area[item.지사코드].incomplete = item.미완료;
              _this.area[item.지사코드].complete = item.완료;
              _this.area[item.지사코드].cancel = item.취소;
              _this.area[item.지사코드].takeover = item.인계;
              _this.area[item.지사코드].emergency = item.응급;
              count += item.미확인 +
                item.미완료 +
                item.완료 +
                item.취소;
            });
            $('span#area_all_total').text(count + '건');

          },
          callback: function () {
            if (!_this.data) return false;
            var areaCode = Object.keys(_this.area);
            var ctx = document.getElementById("barChart_area_all").getContext("2d");
            var myNewChart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: areaCode.map(function (item) { return neo.area[item + '']; }),
                datasets: [
                  {
                    label: '완료',
                    backgroundColor: "rgba(28,132,198,0.5)",
                    borderColor: "rgba(28,132,198,1)",
                    borderWidth: 1,
                    data: areaCode.map(function (item) {
                      return _this.area[item + ''].complete;
                    })
                  },
                  {
                    label: '미완료',
                    backgroundColor: "rgba(248,172,89,0.5)",
                    borderColor: "rgba(248,172,89,1)",
                    borderWidth: 1,
                    data: areaCode.map(function (item) {
                      return _this.area[item + ''].incomplete;
                    })
                  },
                  {
                    label: '미확인',
                    backgroundColor: "rgba(237, 85, 101, 0.5)",
                    borderColor: "rgba(237, 85, 101,1)",
                    borderWidth: 1,
                    data: areaCode.map(function (item) {
                      return _this.area[item + ''].unidentified;
                    })
                  },
                  {
                    label: '취소',
                    backgroundColor: "rgba(35,198,200,0.5)",
                    borderColor: "rgba(35,198,200,1)",
                    borderWidth: 1,
                    data: areaCode.map(function (item) {
                      return _this.area[item + ''].cancel;
                    })
                  }
                ]
              },
              options: chartOptions
            });
            window.areaAllChart = myNewChart;
            areaCode = areaCode.filter(function (area, index) {
              if (area !== '0000' && area !== '0030' && area !== '0040') {
                if (_this.area[area].takeover > 0 || _this.area[area].emergency > 0) {
                  return area;
                }
              }
            });

            ctx = document.getElementById("barChart_area_takeover").getContext("2d");
            myNewChart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: areaCode.map(function (item) { return neo.area[item + '']; }),
                datasets: [
                  {
                    label: '인계건',
                    backgroundColor: "rgba(28,132,198,0.5)",
                    borderColor: "rgba(28,132,198,1)",
                    borderWidth: 1,
                    data: areaCode.map(function (item) {
                      return _this.area[item + ''].takeover;
                    })
                  },
                  {
                    label: '인계건(응급)',
                    backgroundColor: "rgba(248,172,89,0.5)",
                    borderColor: "rgba(248,172,89,1)",
                    borderWidth: 1,
                    data: areaCode.map(function (item) {
                      return _this.area[item + ''].emergency;
                    })
                  }
                ]
              },
              options: chartOptions
            });
            window.areaTakeoverChart = myNewChart;
            var elem = _this.parent.elem;
            var $table = elem.$table.filter('[data-kind="area_takeover"]');
            areaCode.forEach(function (item) {

              var newMember = $('<tr>');
              newMember.append($('<td>').text(neo.area[item + '']));
              newMember.append($('<td>').addClass('text-right').text(
                '(' + _this.area[item + ''].takeover + ' * 3000) + ' +
                '(' + _this.area[item + ''].emergency + ' * 5000) = '
              ));
              newMember.append($('<td>').text(
                ((_this.area[item + ''].takeover * 3000) + (_this.area[item + ''].emergency * 5000)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              ));
              newMember.appendTo($table);
            });
            window.areaTakeoverTable = $table;

            var chartHeight = $table.parent().parent().siblings().height();
            var tableHeight = $table.parent().parent().height();

            $table.parent().parent().css({
              'height': chartHeight + 'px',
              'overflow-y': 'scroll',
              'overflow-x': 'hidden'
            });

          }

        });

      }
    },

    member: {
      data: null,
      Load: function (opt) {
        var _this = this;
        neoAJAX.GetAjax({
          url: '/rank/member',
          data: {
            month: opt.month
          },
          dataType: 'json',
          method: 'GET',
          async: false,
          beforeSend: function () {
            // 직원별 AS건수 AREA LOADING SHOW
            _this.data = null;
            if (window.memberAllChart) {
              window.memberAllChart.destroy();
              window.memberTakeoverChart.destroy();
              window.memberTakeoverTable.empty();
            }
            $('span#member_all_total').text('0건');
          },
          success: function (opts, data) {
            if (data.err) {
              return neoNotify.Show({
                title: '직원별 A/S처리현황',
                text: data.err === 'NODATA' ? _NODATA : data.err.message,
                desktop: false
              });
            }

            _this.data = data.data;
            var count = 0;
            _this.data[0].forEach(function (_item) {
              count += _item.완료 +
                _item.미완료 +
                _item.취소;
            });
            $('span#member_all_total').text(count + '건');
          },
          callback: function () {
            console.log(_this);
            if (!_this.data) return false;

            var ctx = document.getElementById('barChart_member_all').getContext('2d');
            var myNewChart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: _this.data[0].map(function (item) { return item.처리자; }),
                datasets: [
                  {
                    label: '완료',
                    backgroundColor: "rgba(28,132,198,0.5)",
                    borderColor: "rgba(28,132,198,1)",
                    borderWidth: 1,
                    data: _this.data[0].map(function (item) { return item.완료; })
                  },
                  {
                    label: '미완료',
                    backgroundColor: "rgba(248,172,89,0.5)",
                    borderColor: "rgba(248,172,89,1)",
                    borderWidth: 1,
                    data: _this.data[0].map(function (item) { return item.미완료; })
                  },
                  {
                    label: '취소',
                    backgroundColor: "rgba(35,198,200,0.5)",
                    borderColor: "rgba(35,198,200,1)",
                    borderWidth: 1,
                    data: _this.data[0].map(function (item) { return item.취소; })
                  }
                ]
              },
              options: chartOptions
            });
            window.memberAllChart = myNewChart;

            _this.data = _this.data[1].filter(function (item) {
              if (parseInt(item.인계) > 0 || parseInt(item.응급) > 0) {
                return item;
              }
            });


            ctx = document.getElementById("barChart_member_takeover").getContext("2d");
            myNewChart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: _this.data.map(function (item) { return item.처리자; }),
                datasets: [
                  {
                    label: '인계건',
                    backgroundColor: "rgba(28,132,198,0.5)",
                    borderColor: "rgba(28,132,198,1)",
                    borderWidth: 1,
                    data: _this.data.map(function (item) { return item.인계; })
                  },
                  {
                    label: '인계건(응급)',
                    backgroundColor: "rgba(248,172,89,0.5)",
                    borderColor: "rgba(248,172,89,1)",
                    borderWidth: 1,
                    data: _this.data.map(function (item) { return item.응급; })
                  }
                ]
              },
              options: chartOptions

            });
            window.memberTakeoverChart = myNewChart;
            var elem = _this.parent.elem;
            var $table = elem.$table.filter('[data-kind="member_takeover"]');
            _this.data.forEach(function (_item) {
              var newMember = $('<tr>');
              newMember.append($('<td>').text(_item.처리자));
              newMember.append($('<td>').addClass('text-right').text(
                '(' + _item.인계 + ' * 3000) + ' +
                '(' + _item.응급 + ' * 5000) = '
              ));
              newMember.append($('<td>').text(
                ((_item.인계 * 3000) + (_item.응급 * 5000)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              ));
              newMember.appendTo($table);
            });

            window.memberTakeoverTable = $table;
            //
            // var chartHeight = $table.parent().parent().siblings().height();
            // var tableHeight = $table.parent().parent().height();
            //
            // $table.parent().parent().css({
            //   'height' : chartHeight + 'px',
            //   'overflow-y' : 'scroll',
            //   'overflow-x' : 'hidden'
            // });

          }
        });
      },
      Load_Day: function (opt) {

        var _this = this;
        neoAJAX.GetAjax({
          url: '/rank/member',
          data: {
            day: opt.day
          },
          dataType: 'json',
          method: 'GET',
          async: false,
          beforeSend: function () {
            _this.data = null;
            if (window.memberAllChart_day) {
              window.memberAllChart_day.destroy();
            }
          },
          success: function (opts, data) {
            if (data.err) {
              return neoNotify.Show({
                title: '직원별 A/S처리현황',
                text: data.err === 'NODATA' ? _NODATA : data.err.message,
                desktop: false
              });
            }
            _this.data = data.data;
            var count = 0;
            _this.data.forEach(function (_item) {
              count += _item.완료 +
                _item.미완료 +
                _item.취소;
            });
            $('span#member_all_total').text(count + '건');
          },
          callback: function () {
            if (!_this.data) return false;
            var ctx = document.getElementById('barChart_member_all_day').getContext('2d');
            var myNewChart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: _this.data.map(function (item) { return item.처리자; }),
                datasets: [
                  {
                    label: '완료',
                    backgroundColor: "rgba(28,132,198,0.5)",
                    borderColor: "rgba(28,132,198,1)",
                    borderWidth: 1,
                    data: _this.data.map(function (item) { return item.완료; })
                  },
                  {
                    label: '미완료',
                    backgroundColor: "rgba(248,172,89,0.5)",
                    borderColor: "rgba(248,172,89,1)",
                    borderWidth: 1,
                    data: _this.data.map(function (item) { return item.미완료; })
                  },
                  {
                    label: '취소',
                    backgroundColor: "rgba(35,198,200,0.5)",
                    borderColor: "rgba(35,198,200,1)",
                    borderWidth: 1,
                    data: _this.data.map(function (item) { return item.취소; })
                  }
                ]
              },
              options: chartOptions
            });
            window.memberAllChart_day = myNewChart;



          }
        });

      }
    },

    /* Initialize */
    Init: function (_me, callback) {
      $.each(_me, function (i, v) {
        v.Init = _me.Init;
        v.Init();
        v.parent = _me;
      });
      if (typeof callback === 'function') {
        return callback();
      }
    },

    Load: function () {
      var _this = this;
      _this.area.Load(this.options);
      _this.member.Load(this.options);
      _this.company.Load(this.options);
      _this.member.Load_Day(this.options);
    },

    Download: function (type, date) {
      if (type.toLowerCase() === 'area') _DownloadAreaList(date);

      function _DownloadAreaList(date) {
        neoAJAX.GetAjax({
          url: '/rank/download/area',
          data: {
            month: date
          },
          dataType: 'json',
          method: 'GET',
          async: false,
          success: function (opts, result) {
            console.log(result);
            var $table = $('<table/>');
            $table.attr({
              'data-paging': 'false',
              'data-sorting': 'false',
              'data-show-toggle': 'false'
            }).addClass('').appendTo($('body'));
            var columns = [];
            for(var key in result.data[0]){
                columns.push({
                  'name' : key,
                  'title' : key
                });               
            }
            var rows = result.data;
            
            $table.footable({
              'columns': columns,
              'rows': rows
            }).bind({
              'init.ft.table': function (e) {
                console.log('init');
              },
              'draw.ft.table': function (e) {
                //alert('');
                swal({
                  title: 'A/S 처리내역 엑셀저장',
                  type: 'info',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: '저장하기'
                }).then(function () {
                  //window.print();
                  $table.table2excel({
                    //Exclude CSS class specific to this plugin
                    exclude: ".noExl",
                    name: "A/S 처리내역",
                    filename: "as처리내역_" + date,
                    fileext: ".xls",
                    exclude_img: true,
                    exclude_links: true,
                    exclude_inputs: true
                  });
                  $table.remove();
                }, function (dismiss) {
                  $table.remove();
                });
              }
            });
          }
        });
      }
    }
  };

  function AsHistory() {
    this.user_id = neo.user.USER_ID;
    this.user_area = neo.user.user_area;

    var options = localStorage.getItem('as_history_options');
    if (options) {
      this.search_options = JSON.parse(options);
    }

    var elem = this.elem;
    elem.$date = $('input.accept-date');
    elem.$quickDate = $('button.accept-quickDate');
    elem.$service_status = $('button.service_status');
    elem.$view_mode = $('input.view_mode');
    elem.$keyword = $('input#keyword');
    elem.$search = $('button#btnSearch');
    elem.$print = $('button#btnPrint');
    elem.$excel = $('button#btnExcel');
    elem.$table = $('table#data-table');


    var me = this;
    var dateChange = function (e) { me.events.Date_OnChange(e, me); };
    var quickDateClick = function (e) { me.events.QuickDate_OnClick(e.target, me); };
    var statusClick = function (e) { me.events.ServiceStatus_OnClick(e, me); };
    var viewClick = function (e) { me.events.ViewMode_OnClick(e, me); };
    var searchClick = function (e) { me.events.btnSearch_OnClick(e, me); };
    var keywordKeyUp = function (e) { me.events.Keyword_OnKeyUp(e, me); };
    var printClick = function (e) { me.events.print_OnClick(e.target, me); };
    var excelClick = function (e) { me.events.excel_OnClick(e.target, me); };

    elem.$date.bind('change', dateChange);
    elem.$quickDate.bind('click', quickDateClick);
    elem.$service_status.bind('click', statusClick);
    elem.$view_mode.bind('click', viewClick);
    elem.$search.bind('click', searchClick);
    elem.$print.bind('click', printClick);
    elem.$excel.bind('click', excelClick);
    elem.$keyword.bind('keyup', keywordKeyUp);


    this.init();
  }
  AsHistory.prototype = {
    user_id: null,
    user_area: null,
    history: null,
    search_options: {
      //startDate : (new Date()).GetToday('YYYY-MM-DD'),
      startDate: (function () {
        var todate = new Date((new Date()).GetToday('YYYY-MM-DD'));
        todate.setMonth(todate.getMonth() - 1);
        return todate.GetDate_CustomFormat('YYYY-MM-DD');
      })(),
      endDate: (new Date()).GetToday('YYYY-MM-DD'),
      service_status: [ASSTATUS.ACCEPT, ASSTATUS.CONFIRM, ASSTATUS.TAKEOVER, ASSTATUS.TAKEOVERCONFIRM, ASSTATUS.DONE, ASSTATUS.CANCEL],
      view_mode: VIEWMODE.AREA,
      keyword: ''
    },
    elem: {
      $date: null,
      $quickDate: null,
      $service_status: null,
      $view_mode: null,
      $keyword: null,
      $search: null,
      $table: null,
      $dataTable: null,
      $print: null
    },
    events: {
      Date_OnChange: function (e, _this) {
        var selDate = $(e.target).val();
        if ($(e.target).data('name') === 'start') {
          _this.search_options.startDate = selDate;
        } else {
          _this.search_options.endDate = selDate;
        }
      },
      QuickDate_OnClick: function (target, _this) {
        var day = $(target).data('name');
        if (day === 'yesterday') {
          _this.search_options.startDate = (function () {
            var todate = new Date((new Date()).GetToday('YYYY-MM-DD'));
            todate.setDate(todate.getDate() - 1);
            return todate.GetDate_CustomFormat('YYYY-MM-DD');
          })();
          _this.search_options.endDate = _this.search_options.startDate;
        } else {
          _this.search_options.startDate = (new Date()).GetToday('YYYY-MM-DD');
          _this.search_options.endDate = _this.search_options.startDate;
        }
        _this.Load();
      },
      ServiceStatus_OnClick: function (e, _this) {
        $(e.target).toggleClass('active');
      },
      ViewMode_OnClick: function (e, _this) {
        _this.search_options.view_mode = $(e.target).val();
      },
      Keyword_OnKeyUp: function (e, _this) {
        // if(e.type == 'keyup' && (e.keyCode == 13 || e.key == 'Enter')){
        if (e.type == 'keyup') {
          _this.search_options.keyword = $(e.target).val().trim();
          if (e.keyCode == 13 || e.key == 'Enter') {
            _this.Load();
          }
        }
      },
      btnSearch_OnClick: function (e, _this) {
        _this.Load();
      },
      print_OnClick: function (target, _this) {
        // console.log(_this.history);
        // // window.historyData = _this.history;
        // localStorage.setItem('historyData', JSON.stringify(_this.history));
        // window.open('/print', 'popUpWindow');
        _this.ConvertToPrint(_this.history);
      },
      excel_OnClick: function (target, _this) {
        // console.log(_this.history);
        // window.historyData = _this.history;
        // localStorage.setItem('historyData', JSON.stringify(_this.history));
        // localStorage.setItem('neo', JSON.stringify(neo));
        // localStorage.setItem('ASSTATUS', JSON.stringify(ASSTATUS));
        // window.neo = neo;
        // window.ASSTATUS = ASSTATUS;
        // window.open('/excel', 'popUpWindow');
        _this.ConvertToExcel('A/S 처리내역', _this.history);
      }
    },
    init: function () {
      var _this = this;
      var $elem = null;

      $elem = this.elem.$date;
      $elem.each(function (i, v) {
        $(v).val($(v).data('name') === 'start' ? _this.search_options.startDate : _this.search_options.endDate);
        $(v).datepicker({
          format: 'yyyy-mm-dd',
          language: 'kr',
          startView: 2,
          keyboardNavigation: false,
          forceParse: false,
          autoclose: true,
          todayHighlight: true
        });
      });

      if (typeof _this.search_options.service_status === 'string') {
        _this.search_options.service_status = _this.search_options.service_status.split(',');
      }
      $elem = this.elem.$service_status;
      $elem.each(function (i, v) {
        var selected = _this.search_options.service_status.some(function (_i) {
          return $(v).data('status') == _i;
        });
        $(v).addClass(selected ? 'active' : '');
      });

      $elem = this.elem.$view_mode;
      $elem.each(function (i, v) {
        if ($(v).val() == _this.search_options.view_mode) {
          $(v).attr('checked', true);
        }
      });

      _this.Load();
    },
    Load: function () {
      var _this = this;
      var options = _this.search_options;
      options.mode = 0;

      if (options.view_mode == VIEWMODE.AREA) {
        options.view_mode_value = _this.user_area;
      } else {
        options.view_mode_value = _this.user_id;
      }
      //options.service_status = options.service_status.toString();
      options.service_status = "";
      _this.elem.$service_status.each(function (i, v) {
        if ($(v).hasClass('active')) {
          if (options.service_status !== '') options.service_status += ',';
          options.service_status += $(v).data('status');
        }
      });

      neoAJAX.GetAjax({
        url: 'history',
        data: options,
        dataType: 'json',
        async: true,
        method: 'GET',
        beforeSend: function () {
          Pace.start();
          _this.history = {};
        },
        success: function (opt, records) {
          if (records.err) {
            return neoNotify.Show({
              title: 'A/S 처리내역',
              text: records.err === 'NODATA' ? _NODATA : records.err.message,
              desktop: false
            });
          }
          var $table = _this.elem.$table;

          if (records.data && records.data.length) {
            records.data.forEach(function (_item, _index) {

              //_item.접수자 = _item.접수자.length > 3 ? _item.접수자.substring(0,3) + '...' : _item.접수자;

              var temp = ASSTATUS.ServiceBackGround(_item.서비스상태);
              temp.value = _item;
              temp.value["출력"] = '<button class="btn-default btn-sm histroy-print" data-index="' + _index + '"><i class="fa fa-print"></i> 출력</button>';
              records.data[_index] = JSON.parse(JSON.stringify(temp));
            });
          }

          _this.history = {
            mode: 1,
            options: opt.data,
            columns: tableColumn,
            rows: records.data
          };

          $table.footable({
            "columns": tableColumn,
            "rows": records.data
          }).bind({
            'init.ft.table': function (e) {
            },
            'draw.ft.table': function (e) {
              var eachTotal = [0, 0, 0, 0, 0, 0];
              var total = 0;
              records.data.forEach(function (_item) {
                eachTotal[_item.value.서비스상태] += 1;
                total += 1;
              });
              $('#historyTotal>h4').remove();
              $('#historyTotal').append(
                '<h4>전체A/S: ' + total + ' | ' +
                '접수: ' + eachTotal[ASSTATUS.ACCEPT] + ' | ' +
                '확인: ' + eachTotal[ASSTATUS.CONFIRM] + ' | ' +
                '인계: ' + eachTotal[ASSTATUS.TAKEOVER] + ' | ' +
                '인계확인: ' + eachTotal[ASSTATUS.TAKEOVERCONFIRM] + ' | ' +
                '완료: ' + eachTotal[ASSTATUS.DONE] + ' | ' +
                '취소: ' + eachTotal[ASSTATUS.CANCEL] + '</h4> '
              );
              _this.history.total = $('#historyTotal').text();
              $('.histroy-print').on('click', function () {
                var selItem = _this.history.rows[$(this).data('index')];
                selItem.options["expanded"] = true;
                var historyItem = {
                  mode: 2,
                  columns: tableColumn,
                  rows: [selItem]
                };
                window.historyData = historyItem;
                window.open('print', 'popUpWindow');
              });
            },
            'expand.ft.row': function (e, ft, row) {

              var $detail = row.cells.find(function (_cell) {
                return _cell.column.name === '문의내용';
              }).$detail;

              if (typeof $detail.find('td').data('checked') !== 'undefined') return;
              $detail.find('td').data('checked', '1');

              var _index = row.cells.find(function (_cell) {
                return _cell.column.name === '인덱스';
              }).value;

              neoAJAX.GetAjax({
                url: 'history',
                data: {
                  index: _index,
                  mode: 0
                },
                dataType: 'json',
                async: true,
                method: 'GET',
                beforeSend: function () {
                  $detail.find('td').html(neoAJAX.GetSpinners('fadingCircles'));
                },
                success: function (opt, _records) {
                  if (_records.err) {
                    return neoNotify.Show({
                      title: 'A/S 처리내역 [문의내용 로드 실패]',
                      text: _records.err === 'NODATA' ? _NODATA : _records.err.message,
                      desktop: false
                    });
                  }

                  _records.data[0].문의내용 = _records.data[0].문의내용.replace(/src="uploads/, 'src="/uploads');
                  $detail.find('td').html(_records.data[0].문의내용);
                  _this.history.rows.some(function (_cell) {
                    console.log(_cell);
                    if (parseInt(_cell.value.인덱스) === parseInt(_index)) {
                      _cell.value.문의내용 = _records.data[0].문의내용;
                      return true;
                    }
                  })
                },
                callback: function () {
                  $($detail.find('td')).find('.spiner-example').remove();
                }
              });

            }
          });
        },
        callback: function () {

        }
      });
    },
    ConvertToPrint: function (jsonData) {
      var print = '';
      print += '<link rel="stylesheet" href="/plugins/footable-bootstrap/css/footable.bootstrap.min.css">';
      print += '' +
        '<style>' +
        '   @media print {' +
        '     table {' +
        '       font-size: 10px;' +
        '     }' +
        '   }' +
        '</style>';
      var $table = $('<table/>');
      $table.attr({
        'id': 'printTable',
        'data-paging': 'false',
        'data-sorting': 'false',
        'data-show-toggle': 'false'
      }).addClass('hidden').appendTo($('body'));
      var columns = tableColumn;
      var rows = jsonData.rows;
      var options = jsonData.options;
      columns.forEach(function (_col) {
        if (_col.name.match(/본사AS|수수료|출력/gi)) {
          _col.visible = false;
        }
      });
      if (parseInt(jsonData.mode) === 1) {
        if (typeof options.startDate === 'function') options.startDate = options.startDate();
        print += '조회기간 : ' + options.startDate + " ~ " + options.endDate + '  ' + jsonData.total + '<br />';
      }

      $table.footable({
        'columns': columns,
        'rows': rows
      }).bind({
        'init.ft.table': function (e) {
          console.log('init');
        },
        'draw.ft.table': function (e) {
          //alert('');
          swal({
            title: 'A/S 처리내역 출력',
            html: '여백을 <span class="font-bold">취소</span> 혹은 <span class="font-bold">맞춤</span>으로 설정하시면 <br>여백을 조정할 수 있습니다.<br>' +
            ' <small> ( 맞춤 여백 권장값 : 좌/우 = 1.5 | 상/하 = 10) <br> 모니터 해상도에 따라 차이가 있을 수 있습니다. </small><br><br>' +
            ' <span class="font-bold">출력하기</span>를 클릭하면 설정화면이 나타납니다.',
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '출력하기'
          }).then(function () {
            var elemTable = document.getElementById('printTable');
            var printWindow = window.open("");
            printWindow.document.write(print + elemTable.outerHTML);
            setTimeout(function () {
              printWindow.print();
              printWindow.close();
              $table.remove();
            }, 1000);

            // printWindow.close();
            columns.forEach(function (_col) {
              if (_col.name.match(/본사AS|수수료|출력/gi)) {
                _col.visible = true;
              }
            });
            $table.remove();
          }, function (dismiss) {
            $table.remove();
          });
        }
      });

    },
    ConvertToExcel: function (title, jsonData) {
      var $table = $('<table/>');
      $table.attr({
        'data-paging': 'false',
        'data-sorting': 'false',
        'data-show-toggle': 'false'
      }).addClass('hidden').appendTo($('body'));
      var columns = [
        { 'name': '인덱스', 'title': 'ID', 'style': { 'width': 50, 'maxWidth': 50 }, 'breakpoints': 'xs' },
        { 'name': '기관코드', 'title': '기관번호' },
        {
          'name': '기관명칭', 'title': '기관명칭',
          formatter: function (value) {
            if (value.length > 10) {
              return '<a data-toggle="tooltips" title="' + value + '">' + value.substring(0, 10) + '...</a>';
            } else {
              return value;
            }
          }
        },
        {
          'name': '프로그램',
          'title': 'EMR',
          formatter: function (value) {
            if (value === "" || typeof value === "undefined") value = 0;
            switch (parseInt(value)) {
              case 1:
                return "<span class='badge badge-eplus'>Eplus</span>";
              case 8:
                return "<span class='badge badge-medi'>메디</span>";
              case 20:
                return "<span class='badge badge-sense'>센스</span>";
            }
          }
        },
        {
          'name': '본사AS', 'title': '본사AS', "filterable": false,
          formatter: function (value) {
            switch (parseInt(value)) {
              case 0:
                return "";
              case 1:
                return "O";
              default:
            }
          }
        },
        {
          'name': '응급여부', 'title': '응급', "filterable": false,
          formatter: function (value) {
            switch (parseInt(value)) {
              case 0:
                return "";
              case 1:
                return "O";
              default:
            }
          }
        },
        {
          'name': '수수료', 'title': '수수료', "filterable": false,
          formatter: function (value) {
            switch (parseInt(value)) {
              case 0:
                return ""
              case 1:
                return "O"
              default:
            }
          }
        },
        {
          'name': '지사코드',
          'title': '담당지사',
          formatter: function (value) {
            if (value === '' || typeof value === 'undefined') value = '0000';
            return neo.area[value];
          },
          'breakpoints': 'xs'
        },
        {
          'name': '담당자',
          'title': '담당자',
          formatter: function (value) {
            switch (parseInt(value)) {
              case 0:
                return '미정';
              default:
                return neo.users.GetUserName(value).USER_NAME;
            }
          }
        },
        {
          'name': '서비스상태',
          'title': '상태',
          formatter: function (value) {
            value = parseInt(value);
            return ASSTATUS.ServiceName(value);
          },
          'breakpoints': 'xs'
        },
        {
          'name': '접수자', 'title': '접수자', 'breakpoints': 'md sm xs',
          formatter: function (value) {
            if (value.length > 3) {
              return '<a data-toggle="tooltips" title="' + value + '">' + value.substring(0, 3) + '...</a>';
            } else {
              return value;
            }
          }
        },
        {
          'name': '접수일자', 'title': '접수일', 'type': 'date', 'formatString': 'YYYY-MM-DD', 'breakpoints': 'md sm xs',
          formatter: function (value) {
            if (value === '' || typeof value === 'undefined') return '';
            var temp = value.split(' ');
            return temp[0];
          }
        },
        { 'name': '확인자', 'title': '확인자', 'breakpoints': 'md sm xs' },
        {
          'name': '확인일자', 'title': '확인일', 'type': 'date', 'formatString': 'YYYY-MM-DD', 'breakpoints': 'md sm xs',
          formatter: function (value) {
            if (value === '' || typeof value === 'undefined') return '';
            var temp = value.split(' ');
            return temp[0];
          }
        },
        { 'name': '인계자', 'title': '인계자', 'breakpoints': 'md sm xs' },
        {
          'name': '인계일자', 'title': '인계일', 'type': 'date', 'formatString': 'YYYY-MM-DD', 'breakpoints': 'md sm xs',
          formatter: function (value) {
            if (value === '' || typeof value === 'undefined') return '';
            var temp = value.split(' ');
            return temp[0];
          }
        },
        { 'name': '처리자', 'title': '처리자', 'breakpoints': 'md sm xs' },
        {
          'name': '처리일자', 'title': '처리일', 'type': 'date', 'formatString': 'YYYY-MM-DD', 'breakpoints': 'md sm xs',
          formatter: function (value) {
            if (value === '' || typeof value === 'undefined') return '';
            var temp = value.split(' ');
            return temp[0];
          }
        }
      ];
      var rows = jsonData.rows;
      var options = jsonData.options;

      columns.forEach(function (_col) {
        if (_col.name.match(/본사AS|수수료|출력/gi)) {
          _col.visible = false;
        }
      });
      $table.footable({
        'columns': columns,
        'rows': rows
      }).bind({
        'init.ft.table': function (e) {
          console.log('init');
        },
        'draw.ft.table': function (e) {
          //alert('');
          swal({
            title: 'A/S 처리내역 엑셀저장',
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '저장하기'
          }).then(function () {
            //window.print();
            $table.table2excel({
              //Exclude CSS class specific to this plugin
              exclude: ".noExl",
              name: "A/S 처리내역",
              filename: "as처리내역_" + options.startDate + " ~ " + options.endDate,
              fileext: ".xls",
              exclude_img: true,
              exclude_links: true,
              exclude_inputs: true
            });
            $table.remove();
          }, function (dismiss) {
            $table.remove();
          });
        }
      });
    }
  };

  // NeoAS();
  $.neoMNG = NeoManage;

})(window);
