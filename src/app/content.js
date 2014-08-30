(function() {
  'use strict';

  // imports
  var $ = jQuery,
    TableRowIterator = core.TableRowIterator;


  var _items = [];    // list of items


  // =============================================
  // Components
  // =============================================

  // AutreTabs
  // ======================
  var autreTabsTemplate = '\
    <div class="autre-tabs {{ addClass }}">\
      {{#tabs}}\
        <a class="autre-tabs__tab {{selectedTab === link ? "selected" : "" }}" on-click="select:{{link}}" href="{{link}}">{{text}}</a>\
      {{/tabs}}\
    </div>\
  ';

  var AutreTabs = Ractive.extend({
    isolated: true,
    template: autreTabsTemplate,
    data: {
      tabs: [
        {text: 'Scan', link: '#/scan'},
        {text: 'Bid', link: '#/bid'}
      ],
      selectedTab: '#/scan'
    },
    init: function() {
      this.on('select', function(event, link) {
        this.setSelectedTab( link );
      });
    },
    setSelectedTab: function( link ) {
      if ( this.get('selectedTab') === link ) return;

      this.set('selectedTab', link);
    }
  });



  // Scan Item Component
  // ======================
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



  // =============================================
  // Views
  // =============================================

  // Main Menu
  function createMainMenu() {
    var salvageHeader = document.querySelector('#salvage_header');
    var mainMenu = new AutreTabs({
      el: salvageHeader,
      append: salvageHeader.querySelector(':nth-child(2)'),
      data: {
        addClass: 'main-menu'
      }
    });
    return mainMenu;
  }

  // Scan View
  // ======================
  function createScanView() {
    var scanViewTemplate = '\
      <div class="mod--scan-view">\
        {{#items}}\
          <scan-item />\
        {{/items}}\
      </div>\
    ';

    var salvageMainContent = document.querySelector('#salvageMainContent');
    var scanView = new Ractive({
      el: salvageMainContent,
      append: salvageMainContent.querySelector('div:nth-child(3)'),
      template: scanViewTemplate,
      data: { items: _items },
      components: {
        'scan-item': ScanItem
      }
    });
    return scanView;
  }



  // =============================================
  // Application
  // =============================================
  function createApp() {
    var mainMenu = createMainMenu(),
      scanView = createScanView(),
      router = new Rlite(),
      itemsTable = $('#bid_items').length > 0 ? $('#bid_items') : $('#bid_results'),
      tableDataSource = new TableRowIterator( itemsTable );

    function importItemsFromTableData() {
      var start = Date.now();
      while ( tableDataSource.hasNext() && (Date.now() - start < 20) ) {
        _items.push( tableDataSource.next() );
      }

      if ( tableDataSource.hasNext() ) {
        setTimeout( importItemsFromTableData, 25 );
      }
    }

    // define routes and handlers
    router.add('', function() {
      window.location.hash = '/scan';
    });

    router.add('scan', function() {
      mainMenu.setSelectedTab('#/scan');
      $('.mod--scan-view').show();
      $('.main_container').hide();
    });

    router.add('bid', function() {
      mainMenu.setSelectedTab('#/bid');
      $('.main_container').show();
      $('.mod--scan-view').hide();
    });

    // process hash changed events
    function processHash() {
      var hash = location.hash || '#';
      router.run(hash.substr(1));
    }

    window.addEventListener('hashchange', processHash);
    processHash();

    // start building the scan view
    setTimeout(importItemsFromTableData, 25);
  }


  // Crank it up!
  createApp();
}());