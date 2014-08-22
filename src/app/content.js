(function() {
  'use strict';

  // imports
  var $ = jQuery,
    TableRowIterator = core.TableRowIterator;


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