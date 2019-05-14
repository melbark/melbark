/*
voice has keys
*/

/* globals keyCodeNotes, KeyboardKey */

function Voice( audio, options, instrument ) {
  // apply options
  for ( var prop in options ) {
    this[ prop ] = options[ prop ];
  }
  this.audio = audio;
  this.output = audio.createGain();
  this.output.gain.value = this.volume;
  this.instrument = instrument;

  this.createKeyboardKeys();
}

var proto = Voice.prototype;

proto.octaveOffset = 0;
proto.type = 'triangle';
proto.volume = 1;
proto.detune = 0;

proto.createKeyboardKeys = function() {
  // keys that aren't playing
  this.upKeys = [
    new KeyboardKey( this ),
    new KeyboardKey( this ),
    new KeyboardKey( this ),
    new KeyboardKey( this ),
    new KeyboardKey( this )
  ];

  this.upKeys.forEach( function( keyboardKey ) {
    keyboardKey.output.connect( this.output );
  }, this );

  // keys that are playing
  this.downKeys = {};

};

proto.keyDown = function( keyCode ) {
  var note = keyCodeNotes[ keyCode ];
  // bail if not a note or all keys are down
  if ( !note || !this.upKeys.length ) {
    return;
  }
  // bail if key already down
  if ( this.downKeys[ keyCode ] ) {
    return;
  }

  var keyboardKey = this.upKeys.shift();
  keyboardKey.setNote( note );
  var beat = this.instrument.beat;
  keyboardKey.keyDown( beat );
  this.downKeys[ keyCode ] = keyboardKey;
};

proto.keyUp = function( keyCode ) {
  var note = keyCodeNotes[ keyCode ];
  var keyboardKey = this.downKeys[ keyCode ];
  if ( !note || !keyboardKey ) {
    return;
  }

  keyboardKey.keyUp();
  delete this.downKeys[ keyCode ];
  // add key back to pool
  this.upKeys.push( keyboardKey );
};

proto.onBeat = function( beat ) {
  for ( var keyCode in this.downKeys ) {
    var keyboardKey = this.downKeys[ keyCode ];
    keyboardKey.onBeat( beat );
  }
};

proto.onUpBeat = function() {
  for ( var keyCode in this.downKeys ) {
    var keyboardKey = this.downKeys[ keyCode ];
    keyboardKey.onUpBeat();
  }
};

proto.setType = function( type ) {
  this.upKeys.forEach( function( keyboardKey ) {
    keyboardKey.setType( type );
  });

  for ( var keyCode in this.downKeys ) {
    var keyboardKey = this.downKeys[ keyCode ];
    keyboardKey.setType( type );
  }
};
