(function() {
  'use strict';

  // imports
<<<<<<< HEAD
<<<<<<< HEAD
  var $ = jQuery,
    tofu = function(a,c){return a.replace(/{ *([^} ]+) *}/g,function(b,a){b=c;a.replace(/[^.]+/g,function(a){b=b[a]});return b})},
    nsls = function(e){"use strict";function t(e,t){return e+"-"+t}function r(r,n){if(!r||""===r)throw new Error("You must provide a non-empty namespace");n=n||{};var o=n.storageAdapter||e.localStorage,m={setItem:function(e,n){o.setItem(t(r,e),n)},getItem:function(e){return o.getItem(t(r,e))},removeItem:function(e){o.removeItem(t(r,e))}};return m.set=m.setItem,m.get=m.getItem,m.remove=m.removeItem,m}return r}(window);


<<<<<<< HEAD
  var ready = false,                  // flag if global initialization has been completed
    ls = nsls('mod-sgi-cars');      // namespaced localStorage wrapper
      
=======
  var ls = nsls('mod-sgi-cars');      // namespaced localStorage wrapper
  
>>>>>>> fb74460... Moving away from previous style of modding the bid items table directly
  
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

=======
  var $ = jQuery;
>>>>>>> a549a21... Remove all non-essentials
=======
  var $ = jQuery,
    TableRowIterator = core.TableRowIterator;
>>>>>>> b45222a... Cleanup jslint warnings


  var itemsTable = $('#bid_items').length > 0 ? $('#bid_items') : $('#bid_results'),
    appContainer = $('body'),
    originalTableViewContainer = $('#salvageMainContent'),
    scanViewElement = $('<div class="mod--scan-view"></div>').prependTo( appContainer ),
    _items = [];


  // Tabs
  function setActiveView(viewName) {
    if ( !viewName || viewName === '#scan' ) {
      originalTableViewContainer.hide();
      scanViewElement.show();
    } else {
      originalTableViewContainer.show();
      scanViewElement.hide();
    }
  }

  function wireupTabs() {
    var mainTabs = $('<ul class="mod--main-tabs"><li><a href="#scan">Scan</a></li><li><a href="#table">Table</a></li></ul>')
          .prependTo( appContainer );

    mainTabs.on('click', 'a', function() {
      setActiveView( $(this).attr('href') );
    });
  }


  // Scan Item Component
  var scanItemTemplate = '\
    <div class="scan-item scan-item--side-summary">\
      <a href="{{detailUrl}}" title="Click for details" target="_blank">\
        <div class="scan-item__thumbnail"\
          style="background-image: url(/images/salvage_images/{{stockNumber}}/main/1.jpg)">\
        </div>\
      </a>\
      <div class="scan-item__summary">\
        <span class="scan-item__summary__datum reserve-price" title="Reserve price">{{reservePrice}}</span>\
        <span class="scan-item__summary__datum year-model">{{year}} {{model}}</span>\
        <span class="scan-item__summary__datum closing-date" title="Closing date">{{closingDate}}</span>\
        <span class="scan-item__summary__datum location" title="Branch and location">{{branch}} ({{location}})</span>\
        <span class="scan-item__summary__datum stock-number" title="Stock number">#{{stockNumber}}</span>\
      </div>\
    </div>\
  ';

  var ScanItem = Ractive.extend({
    template: scanItemTemplate,
  });


  // Scan View
  var scanViewTemplate = '\
    {{#items}}\
      <scan-item>\
    {{/items}}\
  ';

  var scanView = new Ractive({
    el: scanViewElement,
    template: scanViewTemplate,
    data: { items: _items },
    components: {
      'scan-item': ScanItem
    }
  });



  // Initialization
  function init() {
    var tableDataSource = new TableRowIterator( itemsTable );

    function importItemsFromTableData() {
      var start = Date.now();
      while ( tableDataSource.hasNext() && (Date.now() - start < 20) ) {
        _items.push( tableDataSource.next() );
      }

      if ( tableDataSource.hasNext() ) {
        setTimeout( importItemsFromTableData, 25 );
      }
    }

    wireupTabs();
    setTimeout(importItemsFromTableData, 25);
  }


  // Crank it up!
  init();
}());