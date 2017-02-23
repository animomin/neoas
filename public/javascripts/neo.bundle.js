(function (exports) {
  /**
   * IE8 버전에 Console 객체가 없음.
   */
  exports.console = exports.console || {
    'log': function () { }
  };

  /**
   * IE8 버전에 Trim Method 가 없음.
   */
  if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, '');
    }
  }

  if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
      'use strict';
      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value;
        }
      }
      return undefined;
    };
  }

  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback, thisArg) {
      var T, k;
      if (this === null) {
        throw new TypeError('this is null or not defined');
      }
      var O = Object(this);
      var len = O.length >>> 0;
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }
      if (arguments.length > 1) {
        T = thisArg;
      }
      k = 0;
      while (k < len) {
        var kValue;
        if (k in O) {
          kValue = O[k];
          callback.call(T, kValue, k, O);
        }
        k++;
      }
    };
  }




  /**
   * F5 or 새로고침을 막음
   * 개발중에는 활성화 하지 않음
   * IE8에서 CMS 모듈 초기화후 인증서 비밀번호를 최초에만 입력하고 저장 기억하도록 한다면
   * 새로고침해도 자동으로 입력되게 해서 막을 수 있음... 찾아보자
   * 해결해서 사용안할꺼임
   */
  // window.onload = function () {
  //     document.onkeydown = function (e) {
  //         return (e.which || e.keyCode) != 116;
  //     };
  // }
})(window);
