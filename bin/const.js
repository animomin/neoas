var neoConst = {
  settings : {
    _loadLayouts : function(){
      //fs.readFile('public/settings/layouts/layers_sense.json','utf8', function(error, data) {

      fs.readFile(rootPath + '/public/settings/layouts/layers_sense.json','utf8', function(error, data) {
        if (error) {
          console.log(error);
        } else {
          var layouts = JSON.parse(data);
          var keys = Object.keys(layouts);
          keys.forEach(function(item){
            emrs[item].layouts = layouts[item];
          });
        }
      });
    }
  },
  emrs : {
    _statusDataClear : function(callback){
      this[1].statusData =[];
      this[2].statusData = [];
      this[6].statusData = [];
      this[7].statusData = [];
      this[8].statusData = [];
      this[10].statusData = [];
      this[20].statusData = [];
      if(typeof callback === 'function') return callback();
      return;
    },
    1 : {
      id : 1,
      name : "Eplus",
      badge : "badge-eplus",
      chart : {
        backgroundColor : 'rgba(53, 162, 70, 0.5)',
        hoverbackgroundColor : 'rgba(53, 162, 70, 0.7)',
        borderColor : 'rgb(53, 162, 70)',
        borderWidth : 1
      },
      layouts : {},
      statusData : [],
      _getVersions : function(callback){
        return;
      }
    },
    2 : {
      id : 2,
      name : "Hplus",
      badge : "badge-eplus",
      chart : {
        backgroundColor : 'rgba(53, 162, 70, 0.5)',
        hoverbackgroundColor : 'rgba(53, 162, 70, 0.7)',
        borderColor : 'rgb(53, 162, 70)',
        borderWidth : 1
      },
      layouts : {},
      statusData : [],
      _getVersions : function(callback){
        return;
      }
    },
    6 : {
      id : 6,
      name : "EplusCL",
      badge : "badge-eplus",
      chart : {
        backgroundColor : 'rgba(53, 162, 70, 0.5)',
        hoverbackgroundColor : 'rgba(53, 162, 70, 0.7)',
        borderColor : 'rgb(53, 162, 70)',
        borderWidth : 1
      },
      layouts : {},
      statusData : [],
      _getVersions : function(callback){
        return;
      }
    },
    7 : {
      id : 7,
      name : "Echart",
      badge : "badge-echart",
      chart : {
        backgroundColor : 'rgba(141, 59, 255, 0.5)',
        hoverbackgroundColor : 'rgba(141, 59, 255, 0.7)',
        borderColor : 'rgb(141, 59, 255)',
        borderWidth : 1
      },
      layouts : {},
      statusData : [],
      _getVersions : function(callback){
        return;
      }
    },
    8 : {
      id : 8,
      name : "MediChart",
      badge : "badge-medi",
      chart : {
        backgroundColor : 'rgba(68, 107, 189, 0.5)',
        hoverbackgroundColor : 'rgba(68, 107, 189, 0.7)',
        borderColor : 'rgb(68, 107, 189)',
        borderWidth : 1
      },
      layouts : {},
      statusData : [],
      _getVersions : function(callback){
        return;
      }
    },
    10 : {
      id : 10,
      name : "HanimacPro",
      badge : "badge-medi",
      chart : {
        backgroundColor : 'rgba(68, 107, 189, 0.5)',
        hoverbackgroundColor : 'rgba(68, 107, 189, 0.7)',
        borderColor : 'rgb(68, 107, 189)',
        borderWidth : 1
      },
      layouts : {},
      statusData : [],
      _getVersions : function(callback){
        return;
      }
    },
    20 : {
      id : 20,
      name : "SENSE",
      badge : "badge-sense",
      chart : {
        backgroundColor : 'rgba(63, 123, 249, 0.5)',
        hoverbackgroundColor : 'rgba(63, 123, 249, 0.7)',
        borderColor : 'rgb(63, 123, 249)',
        borderWidth : 1
      },
      layouts : {},
      statusData : [],
      _getVersions : function(callback){
        var query =global.querys16._Versions_SENSE;
        if(server16.connection.connected){
          server16.RecordSet(query, function(err, records){
            callback(err, records);
          });
        }else{
          console.log('Server16 is disconnected');
        }
        return;
      }
    }
  },
  area : {
    "0000" : "본 사",
    "0001" : "서울중부",
    "0002" : "경기북부",
    "0003" : "경기남부",
    "0004" : "711호",
    "0005" : "경기중부",
    "0006" : "최원효",
    "0007" : "광주지사",
    "0008" : "부산본사",
    "0009" : "대구지사",
    "0010" : "제주지사",
    "0011" : "충청지사",
    "0012" : "전주지사",
    "0013" : "강원지사",
    "0014" : "경서지사",
    "0015" : "경인지사",
    "0016" : "서울강남",
    "0017" : "서울강북",
    "0018" : "서울강서",
    "0019" : "안동지사",
    "0020" : "포항지사",
    "0021" : "울산지사",
    "0022" : "경기서부",
    "0023" : "서울강동",
    "0024" : "경기동부B",
    "0025" : "서울서부",
    "0026" : "한방사업부",
    "0027" : "수원남부",
    "0028" : "최종용",
    "0029" : "영업부",
    "0030" : "메디본사",
    "0031" : "메디남부",
    "0032" : "메디광주",
    "0033" : "김진우",
    "0034" : "711-서울강동",
    "0035" : "711-최종용",
    "0036" : "711-서울서부",
    "0037" : "711-김진우",
    "0039" : "업체",
    "0040" : "본사-담당자",
    "0041" : "폴라리스"
  }
};

module.exports = neoConst;
