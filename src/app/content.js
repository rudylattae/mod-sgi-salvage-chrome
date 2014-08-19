(function() {
  'use strict';

  // imports
  var $ = jQuery;


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
    //setActiveView();
  }

  init();
}());