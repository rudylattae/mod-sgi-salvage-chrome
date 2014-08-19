(function() {
  'use strict';

  // imports
  var $ = jQuery,
    TableRowIterator = core.TableRowIterator;


  var itemsTable = $('#bid_items').length > 0 ? $('#bid_items') : $('#bid_results'),
    appContainer = $('body'),
    originalTableViewContainer = $('#salvageMainContent'),
    scanViewElement = $('<div class="mod--scan-view"></div>').prependTo( appContainer );


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


  // Scan View
  function createScanView() {
    var items = [],
      template = '\
        {{#items}}\
          <div class="scan-item">\
            <a href="{{detailUrl}}" title="Click for details" target="_blank">\
              <div class="scan-item--thumbnail"\
                style="background-image: url(/images/salvage_images/{{stockNumber}}/main/1.jpg)">\
              </div>\
            </a>\
            <div class="scan-item--highlight">{{reservePrice}}</div>\
            <div class="scan-item--summary">{{year}} {{model}}</div>\
          </div>\
        {{/items}}\
      ',
      tt = new TableRowIterator( itemsTable ),
      vm;

    while ( tt.hasNext() ) {
      items.push( tt.next() );
    }

    vm = new Ractive({
      el: scanViewElement,
      template: template,
      data: { items: items }
    });
  }


  // Initialization
  function init() {
    wireupTabs();
    createScanView();
  }


  // Crank it up!
  init();
}());