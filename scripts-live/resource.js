"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Resource Class
var Resource = function () {
  function Resource(initVal, initRate, initCap) {
    _classCallCheck(this, Resource);

    this.value = initVal;
    this.rate = initRate;
    this.cap = initCap;
  }

  // Temporarily changes a rate for a given amount of time


  _createClass(Resource, [{
    key: "tmpChange",
    value: function tmpChange(amount, time) {
      var _this = this;

      var hold = this.rate;
      this.rate = amount;
      setTimeout(function () {
        _this.rate = hold;
      }, time);
    }
  }]);

  return Resource;
}();