var neoConst = {
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
      statusData : [],
      _getVersions : function(callback){
        return;
      }
    },
    2 : {
      id : 2,
      name : "Hplus",
      badge : "badge-eplus",
      statusData : [],
      _getVersions : function(callback){
        return;
      }
    },
    6 : {
      id : 6,
      name : "EplusCL",
      badge : "badge-eplus",
      statusData : [],
      _getVersions : function(callback){
        return;
      }
    },
    7 : {
      id : 7,
      name : "Echart",
      badge : "badge-echart",
      statusData : [],
      _getVersions : function(callback){
        return;
      }
    },
    8 : {
      id : 8,
      name : "MediChart",
      badge : "badge-medi",
      statusData : [],
      _getVersions : function(callback){
        return;
      }
    },
    10 : {
      id : 10,
      name : "HanimacPro",
      badge : "badge-medi",
      statusData : [],
      _getVersions : function(callback){
        return;
      }
    },
    20 : {
      id : 20,
      name : "SENSE",
      badge : "badge-sense",
      statusData : [],
      _getVersions : function(callback){
        var query =global.querys16._Versions_SENSE;
        if(neoServer16.connection.connected){
          neoServer16.RecordSet(query, function(err, records){
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
