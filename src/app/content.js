(function() {
  'use strict';

  // imports
  var $ = jQuery,
    tofu = function(a,c){return a.replace(/{ *([^} ]+) *}/g,function(b,a){b=c;a.replace(/[^.]+/g,function(a){b=b[a]});return b})},
    nsls = function(e){"use strict";function t(e,t){return e+"-"+t}function r(r,n){if(!r||""===r)throw new Error("You must provide a non-empty namespace");n=n||{};var o=n.storageAdapter||e.localStorage,m={setItem:function(e,n){o.setItem(t(r,e),n)},getItem:function(e){return o.getItem(t(r,e))},removeItem:function(e){o.removeItem(t(r,e))}};return m.set=m.setItem,m.get=m.getItem,m.remove=m.removeItem,m}return r}(window);


  var ls = nsls('mod-sgi-cars');      // namespaced localStorage wrapper
  
  
  var db = {
    _items: [],

    init: function() {
      if (this._items.length === 0) {
        var data = JSON.parse( ls.get('items') );
        this._items = data || [];
      }
    },

    all: function() {
        return this._items;
    },

    add: function ( item ){
      this._items.unshift( item );
      ls.set('items', JSON.stringify( this._items ));
    },

    has: function( item ) {
      var i = 0,
        z = this._items.length;
      for (; i < z; i++) {
        if (this._items[i].stockNumber === item.stockNumber) 
          return true;
      }
      return false;
    }
  };
  db.init();



  // perform global initialization
  function init() {
    var itemsTable = $('#bid_items').length > 0 ? $('#bid_items') : $('#bid_results'),
      appContainer = $('body'),
      originalTableViewContainer = $('#salvageMainContent'),
      scanViewElement = $('<div class="mod--scan-view"></div>').prependTo(appContainer),
      mainTabs = $('<ul class="mod--main-tabs"><li><a href="#scan">Scan</a></li><li><a href="#table">Table</a></li></ul>')
        .prependTo(appContainer); 

    function setActiveView(viewName) {
      if (!viewName || viewName === '#scan') {
        originalTableViewContainer.hide();
        scanViewElement.show();
      } else {

        originalTableViewContainer.show();
        scanViewElement.hide();
      }
    }

    mainTabs.on('click', 'a', function() {
      setActiveView($(this).attr('href'));
    });
    setActiveView();
  }

  init();


  var tt = new core.TableRowIterator($('#bid_items'));
  console.log( tt.next() );
}());