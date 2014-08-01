(function() {
  'use strict';

  // imports
  var $ = jQuery,
    tofu = function(a,c){return a.replace(/{ *([^} ]+) *}/g,function(b,a){b=c;a.replace(/[^.]+/g,function(a){b=b[a]});return b})},
    nsls = function(e){"use strict";function t(e,t){return e+"-"+t}function r(r,n){if(!r||""===r)throw new Error("You must provide a non-empty namespace");n=n||{};var o=n.storageAdapter||e.localStorage,m={setItem:function(e,n){o.setItem(t(r,e),n)},getItem:function(e){return o.getItem(t(r,e))},removeItem:function(e){o.removeItem(t(r,e))}};return m.set=m.setItem,m.get=m.getItem,m.remove=m.removeItem,m}return r}(window);


  var ready = false,                  // flag if global initialization has been completed
    ls = nsls('mod-sgi-cars');      // namespaced localStorage wrapper
      
  
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


  function ItemsTableModManager( table ) {
    var self = this;

    self.init = function init() {
      // setup table for mod
      if ( table.attr('data-mod-ready') ) return;

      table.find('thead tr').prepend('<th class="header">&nbsp;</th>');
      table.find('tbody tr').each(function(i, row) {
        $(row).prepend('<td class="js-mods"></td>'); 
      });

      table.attr('data-mod-ready', true);
    };

    self.install = function install( mod ) {
      table.find('tbody tr').each(function(i, row) {
        mod.install( row, self );
      });
    };

    self.findStockNumberColumn = function findStockNumberColumn() {
      var found = 0;

      table.find('thead tr th').each(function(i, cell) {
        if ( cell.textContent === 'Stock Number' ) {
          found = i;
          return false;
        }
      });
      return found;
    };

    self.findStoreNameColumn = function findStoreNameColumn() {
      var found = 0;

      table.find('thead tr th').each(function(i, cell) {
        if ( cell.textContent === 'Branch' ) {
          found = i;
          return false;
        }
      });
      return found;
    };
  }


  function ItemThumbnailMod() {
    var self = this,
      detailsTemplate = '/lcgi/salvage_bid_site/comp_details.cgi?stock_num={stockNumber}&store={storeName}',
      mainPhotoUrlTemplate = '/images/salvage_images/{stockNumber}/main/1.jpg',
      itemPhotoTemplate =
          '<div class="mod--thumbnail" target="_blank"> \
              <a href="{detailsUrl}" target="_blank"><img alt="loading..." src="{thumbnailUrl}" width="245"/></a> \
          </div>',
      stockNumberColumn,
      storeNameColumn;

    self.install = function install( row, tableManager ) {
      if ( $('.js-mods .mod--thumbnail', row).length > 0 ) return;

      if ( typeof stockNumberColumn === 'undefined') stockNumberColumn = tableManager.findStockNumberColumn();
      if ( typeof storeNameColumn === 'undefined') storeNameColumn = tableManager.findStoreNameColumn();

      var stockNumber = $('td:eq(' + stockNumberColumn + ')', row).text(),
        storeName = $('td:eq(' + storeNameColumn + ')', row).text(),
        detailsUrl = tofu( detailsTemplate, {stockNumber: stockNumber, storeName: storeName} ),
        thumbnailUrl = tofu( mainPhotoUrlTemplate, {stockNumber: stockNumber} ),
        component = tofu( itemPhotoTemplate, { thumbnailUrl: thumbnailUrl, stockNumber: stockNumber, detailsUrl: detailsUrl } );

      $('.js-mods', row).append( component ); 
    };

    self.uninstall = function uninstall() {
      throw new Error('Not implemented');
    };
  }


  // perform global initialization
  function init() {
    if ( ready ) return;

    var itemsTable = $('#bid_items').length > 0 ? $('#bid_items') : $('#bid_results'),
      tableManager = new ItemsTableModManager( itemsTable ),
      thumbnailMod = new ItemThumbnailMod();

    tableManager.init();
    tableManager.install( thumbnailMod );
    ready = true;

    var appContainer = $('body'),
      originalTableViewContainer = $('#salvageMainContent'),
      scanViewElement = $('<div class="mod--scan-view"></div>').prependTo(appContainer),
      thumbs = itemsTable.find('.mod--thumbnail').clone().appendTo(scanViewElement),
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
}());