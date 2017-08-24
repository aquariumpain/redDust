"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Resource Class
var BoughtItems = function BoughtItems(data) {
  _classCallCheck(this, BoughtItems);

  this.items = data.items;
  this.upgrades = data.upgrades;
};
