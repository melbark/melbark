var guid = 0;
var arpBoardClass = 'arp-board';

function ArpBoard( parent ) {
  this.id = guid;
  guid++;
  this.parent = parent;
  this.create();

  this.arpeggio = [];
}

var proto = ArpBoard.prototype;

proto.create = function() {
  this.element = document.createElement('div');
  this.element.className = arpBoardClass;
  this.columns = [];

  for ( var i=0; i<8; i++ ) {
    var column = this.createColumn( i );
    this.element.appendChild( column );
    this.columns.push( column );
  }

  this.parent.appendChild( this.element );
  this.element.addEventListener( 'click', this );
  this.element.addEventListener( 'mousedown', this );
};

proto.createColumn = function( columnIndex ) {
  var column = document.createElement('div');
  column.className = getBEMClass( 'column', columnIndex );
  column.setAttribute( 'data-column', columnIndex );
  // create radios
  for ( var i=7; i > -5; i-- ) {
    var cell = document.createElement('div');
    var value = i == -4 ? 'rest' : i;
    cell.className = getBEMClass( 'cell', value );
    cell.setAttribute( 'data-value', value );
    column.appendChild( cell );
  }
  return column;
};

function getBEMClass( elemName, modName ) {
  var className = arpBoardClass + '__' + elemName;
  if ( modName !== undefined ) {
    className += ' ' + className + '--' + modName;
  }
  return className;
}


proto.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

proto.onclick = function( event ) {
  // only cell clicks
  if ( !event.target.classList.contains('arp-board__cell') ) {
    return;
  }
  this.setSelectedCell( event.target );
};

proto.onmousedown = function( event ) {
  if ( !event.target.classList.contains('arp-board__cell') ) {
    return;
  }
  event.preventDefault();
  this.setSelectedCell( event.target );
  this.element.addEventListener( 'mouseover', this );
  window.addEventListener( 'mouseup', this );
};

proto.onmouseover = function( event ) {
  if ( !event.target.classList.contains('arp-board__cell') ) {
    return;
  }
  this.setSelectedCell( event.target );
};

proto.onmouseup = function() {
  this.element.removeEventListener( 'mouseover', this );
  window.removeEventListener( 'mouseup', this );
};

// -----  ----- //

proto.setArpeggio = function( arp ) {
  this.arpeggio = arp.slice(0);
  this.arpeggio.forEach( function( noteIndex, i ) {
    this.setSelectedCellClass( i, noteIndex );
  }, this );
  this.onArpeggioSet();
};

// placeholder, lazy event
proto.onArpgeggioSet = function() {};

proto.setSelectedCell = function( cell ) {
  var colIndex = parseInt( cell.parentNode.getAttribute('data-column'), 10 );
  var value = cell.getAttribute('data-value');
  value = value == 'rest' ? value : parseInt( value, 10 );
  this.setSelectedCellClass( colIndex, value );
  this.arpeggio[ colIndex ] = value;
  this.setArpeggio( this.arpeggio );
  this.onArpeggioSet();
};

proto.setSelectedCellClass = function( colIndex, value ) {
  var column = this.columns[ colIndex ];
  var offCell = column.querySelector('.is-selected');
  var onCell = column.querySelector( '.' + arpBoardClass + '__cell--' + value );
  if ( offCell ) {
    offCell.classList.remove('is-selected');
  }
  onCell.classList.add('is-selected');
};
