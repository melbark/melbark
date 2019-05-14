/* globals keyCodeNotes, Voice, arpBoard0, getNoteIndex, getNoteFromNumber, modulo, keyboardElem */

var AudioCtx = window.AudioContext || window.webkitAudioContext;

// -----  ----- //

function Instrument() {
  this.voices = [];
  document.addEventListener( 'keydown', this );
  document.addEventListener( 'keyup', this );
  this.audio = context;
  // output
  this.output = this.audio.createGain();
  this.output.gain.value = 1;
  // destination
  this.destination = this.audio.destination;

  this.startBeats();
  // hash of down notes
  this.downNotes = {};

  keyboardElem.addEventListener( 'mousedown', this.onKeyboardMousedown.bind( this ) );
  this._onKeyboardMouseover = this.onKeyboardMouseover.bind( this );
  this._onKeyboardMouseup = this.onKeyboardMouseup.bind( this );
}

var proto = Instrument.prototype;

// ----- events ----- //

proto.handleEvent = function( event ) {
  var handler = this[ 'on' + event.type ];
  if ( this[ 'on' + event.type ] ) {
    handler.call( this, event );
  }
};

proto.onkeydown = function( event ) {
  if ( event.keyCode == 91 ) {
    this.isCmdDown = true;
  }
  if ( this.isCmdDown ) {
    return;
  }

  this.keyDown( event.keyCode );
};

proto.onkeyup = function( event ) {
  if ( event.keyCode == 91 ) {
    this.isCmdDown = false;
  }
  // don't stop pointer key
  if ( event.keyCode == this.pointerDownKeyCode ) {
    return;
  }
  this.keyUp( event.keyCode );
};

// ----- play/stop note ----- //

proto.keyDown = function( keyCode ) {
  var noteName = keyCodeNotes[ keyCode ];
  // bail if not note, or of already down
  if ( !noteName ) {
    return;
  }
  changeKeyElemDown( keyCode, 'add' );
  this.voices.forEach( function( voice ) {
    voice.keyDown( keyCode );
  });
  // add flag
  this.downNotes[ noteName ] = true;
  this.addPlayingClasses();
};

proto.keyUp = function( keyCode ) {
  var noteName = keyCodeNotes[ keyCode ];
  if ( !noteName ) {
    return;
  }
  changeKeyElemDown( keyCode, 'remove' );
  this.voices.forEach( function( voice ) {
    voice.keyUp( keyCode );
  });
  delete this.downNotes[ noteName ];
};

function changeKeyElemDown( keyCode, method ) {
  var keyElem = keyboardElem.querySelector( '.keyboard__key--' + keyCode );
  keyElem.classList[ method ]('is-down');
}

proto.onKeyboardMousedown = function( event ) {
  var keyCode = getPointerKeyCode( event.target );
  if ( !keyCode ) {
    return;
  }
  event.preventDefault();
  this.keyDown( keyCode );
  // keep track
  this.pointerDownKeyCode = keyCode;
  keyboardElem.addEventListener( 'mouseover', this._onKeyboardMouseover );
  window.addEventListener( 'mouseup', this._onKeyboardMouseup );
};

proto.onKeyboardMouseover = function( event ) {
  var keyCode = getPointerKeyCode( event.target );
  if ( !keyCode ) {
    return;
  }
  this.keyUp( this.pointerDownKeyCode );
  this.keyDown( keyCode );
  this.pointerDownKeyCode = keyCode;
};

proto.onKeyboardMouseup = function() {
  this.keyUp( this.pointerDownKeyCode );
  delete this.pointerDownKeyCode;
  keyboardElem.removeEventListener( 'mouseover', this._onKeyboardMouseover );
  window.removeEventListener( 'mouseup', this._onKeyboardMouseup );
};

function getPointerKeyCode( elem ) {
  if ( elem.nodeName != 'KBD' ) {
    return;
  }
  // get keycode from class, hacky but I don't want to type it in again
  var keyCode = elem.className.match( /keyboard__key--(\d+)/ );
  return keyCode && keyCode[1];
}

// ----- addVoice ----- //

// shape, volume, detune, octave offset
proto.addVoice = function( options ) {
  options = options || {};
  var voice = new Voice( this.audio, options, this );
  voice.output.connect( this.output );
  this.voices.push( voice );
};

// ----- beats ----- //

proto.startBeats = function() {
  this.lastBeat = new Date();
  this.beat = 0;
  this.animate();
};

proto.animate = function() {
  var now = new Date();
  var time = now - this.lastBeat;
  // upbeat
  if ( !this.didUpBeat && time >= settings.beatTime * settings.holdTime ) {
    this.voices.forEach( function( voice ) {
      voice.onUpBeat();
    });
    // changeKeyElemPlaying()
    var playingKeyElems = keyboardElem.querySelectorAll('.is-playing');
    for ( var i=0; i < playingKeyElems.length; i++ ) {
      playingKeyElems[i].classList.remove('is-playing');
    }
  }

  this.onBeat( time, now );

  var _this = this;
  requestAnimationFrame( function() {
    _this.animate();
  });
};

proto.onBeat = function( time, now ) {
  if ( time < settings.beatTime ) {
    return;
  }
  var _this = this;
  this.beat++;
  this.voices.forEach( function( voice ) {
    voice.onBeat( _this.beat );
  });
  this.lastBeat = now;
  delete this.didUpBeat;
  // classes
  this.addPlayingClasses();
};

proto.addPlayingClasses = function() {
  var arp = arpBoard0.arpeggio;
  var toneIndex = arp[ this.beat % arp.length ];
  for ( var note in this.downNotes ) {
    var noteIndex = getNoteIndex( note );
    var arpNote = getNoteFromNumber( noteIndex + toneIndex );
    var keyElem = keyboardElem.querySelector( '[data-note="' + arpNote + '"]');
    if ( keyElem ) {
      keyElem.classList.add('is-playing');
    }
  }

  var activeCol = this.beat % arp.length;
  var inactiveCol = modulo( this.beat - 1, arp.length );
  arpBoard0.columns[ activeCol ].classList.add('is-playing');
  arpBoard0.columns[ inactiveCol ].classList.remove('is-playing');
};

// ----- filter ----- //

proto.createFilter = function() {
  var filter = this.audio.createBiquadFilter();
  return filter;
};
