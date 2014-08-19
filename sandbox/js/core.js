(function(g) {
    'use strict';

    // imports
    var $ = jQuery;

    // exports
    var api;


    function TableRowIterator( el, logger ) {
        if ( typeof el === 'undefined' ) throw new Error('You must provide a table element');
        this._el = el;
        this._cursor = 1;
        this._columns = ['year', 'make', 'model', 'branch', 'location', 'stockNumber', 
                            'closingDate', 'reservePrice'];
        this._extra = {
            year: {
                columnName: 'detailUrl',
                element: 'a',
                source: 'attr',
                value: 'href'
            }
        };

        if ( $('tr', this._el).length === 0 && logger && logger.warn ) 
            logger.warn('The provided table does not have any rows');
    }

    TableRowIterator.prototype.hasNext = function hasNext() {
        return this._currentRow() ? this._currentRow().length > 0 : false;
    };

    TableRowIterator.prototype.next = function next() {
        if ( !this.hasNext() ) throw new Error('StopIteration');

        var data = this._serializeRowData(this._currentRow());
        this._cursor = this._cursor + 1;
        return data;
    };

    TableRowIterator.prototype._currentRow = function _currentRow() {
        return this._el.find('tr:eq(' + this._cursor + ')');
    };

    TableRowIterator.prototype._serializeRowData = function _serializeRowData( row ) {
        var serialized = {},
            cells = row.find('td'),
            i = 0,
            max = this._columns.length;

        for (; i < max; i++) {
            serialized[this._columns[i]] = cells[i].innerText;
            var metaData = this._extra[this._columns[i]];            
            
            if (metaData) {
                var extraData = $(cells[i]).find(metaData.element).attr('href');
                serialized[metaData.columnName] = extraData;
            }
        }

        return serialized;
    };

    TableRowIterator.prototype.reset = function reset() {
        this._cursor = 1;
    };



    function GenericRepository( localStorageWrapper, mapper ) {
        if ( typeof localStorageWrapper === 'undefined' ) 
            throw new Error('You must provide a localStorageWrapper');
        if ( typeof mapper !== 'undefined' && (!mapper.toModel && !mapper.toJS) )
             throw new Error('Mapper must implement "toModel" and "toJS"');

        this._ls = localStorageWrapper;
        this._mapper = mapper;
    }

    GenericRepository.prototype.add = function add( item ) {
        if ( typeof this._mapper === 'undefined' ) return this._ls.save( item );
        return this._ls.save( this._toJS( item ) );
    };

    GenericRepository.prototype.update = function update( item ) {
        if ( typeof this._mapper === 'undefined' ) return this._ls.update( item );
        return this._ls.update( this._toJS( item ) );
    };

    GenericRepository.prototype.remove = function remove( query ) {
        return this._ls.destroy( query );
    };

    GenericRepository.prototype.find = function find( query ) {
        var entities = this._ls.find( query );

        if ( typeof this._mapper === 'undefined' ) return entities;
        return this._toModels( entities );
    };

    GenericRepository.prototype.get = function get( id ) {
        var entity = this._ls.get( id );

        if ( !entity ) return null;
        if ( typeof this._mapper === 'undefined' ) return entity;
        return this._toModel( entity );
    };

    GenericRepository.prototype.all = function all() {
        var entities = this._ls.all();

        if ( typeof this._mapper === 'undefined' ) return entities;
        return this._toModels( entities );
    };

    GenericRepository.prototype.count = function count() {
        return this._ls.size();
    };

    GenericRepository.prototype._toModels = function( entities ) {
        var i = 0,
            max = entities.length,
            models = [];

        for (; i < max; i++) {
            models.push( this._toModel( entities[i] ) );
        }
        return models;
    };

    GenericRepository.prototype._toModel = function( entity ) {
        return new this._mapper.toModel( entity );
    };

    GenericRepository.prototype._toJS = function( model ) {
        return new this._mapper.toJS( model );
    };



    function ItemSummaryImporter( tableRowIterator, repository ) {
        this._iter = tableRowIterator;
        this._repo = repository;
    }

    ItemSummaryImporter.prototype.run = function( force ) {
        while( this._iter.hasNext() ) {
            var item = this._iter.next();
            if ( !this._repo.get( item.stockNumber ) || force ) {
                this._repo.add( item );
            }
        }
    };


    api = {
        TableRowIterator: TableRowIterator,
        GenericRepository: GenericRepository,
        ItemSummaryImporter: ItemSummaryImporter
    };

    g.core = g.core || api;
})(this);
