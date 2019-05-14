/*
keyboard key plays notes
can change its reference note
*/

/* globals Tone, arpBoard0, getNoteIndex, getNoteFromNumber */


function KeyboardKey( voice ) {
  this.voice = voice;
  this.audio = voice.audio;

  var output = this.audio.createGain();
  output.gain.value = 1;

  this.output = output;

  this.isKeyDown = false;
  // hash of tones for arpeggiator
  this.tones = {};

  for ( var i=-3; i < 8; i++ ) {
    var tonearp = new Tonearp( this );
    this.tones[ i ] = tonearp;
    tonearp.output.connect( this.output );
  }
}

// -----  ----- //


var proto = KeyboardKey.prototype;

proto.setNote = function( note ) {
  var noteIndex = getNoteIndex( note );
  var now = this.audio.currentTime;
  // set frequencies of all tones for key
  for ( var index in this.tones ) {
    var tonearp = this.tones[ index ];
    index = parseInt( index, 10 );
    var noteName = getNoteFromNumber( index + noteIndex );
    var freq = getFrequency( noteName, this.voice.octaveOffset );
    tonearp.osc.frequency.setValueAtTime( freq, now );
  }
};

var semitoneMap = {
  C: -9,
  D: -7,
  E: -5,
  F: -4,
  G: -2,
  A: 0,
  B: 2,
};

var PIANO_BASE = Math.pow( 2, 1/12 );

/**
 * @param {String} noteName - note and octave: 'C4'
 */
function getFrequency( noteName, octaveOffset ) {
  var note = noteName[0];
  var octave = noteName[1];
  var semitone = semitoneMap[ note ] + ( octave - 4 + octaveOffset ) * 12;
  return 440 * Math.pow( PIANO_BASE, semitone );
}


proto.keyDown = function( beat ) {
  if ( this.isKeyDown ) {
    return;
  }
  this.isKeyDown = true;
  if ( !this.voice.instrument.didUpBeat ) {
    this.onBeat( beat );
  }
};

proto.keyUp = function() {
  this.stopPlayingTone();
  this.isKeyDown = false;
};

proto.stopPlayingTone = function() {
  if ( this.playingTone ) {
    this.playingTone.stop();
    delete this.playingTone;
  }
};

proto.onBeat = function( beat ) {
  var arp = arpBoard0.arpeggio;
  var toneIndex = arp[ beat % arp.length ];
  this.stopPlayingTone();
  this.playTone( toneIndex );
};

proto.onUpBeat = function() {
  this.stopPlayingTone();
};

// -----  ----- //

proto.playTone = function( index ) {
  if ( index === null || index == 'rest' ) {
    return;
  }
  var tone = this.tones[ index ];
  tone.play();
  this.playingTone = tone;
};

proto.stopTone = function( index ) {
  var tone = this.tones[ index ];
  if ( tone ) {
    tone.stop();
  }
};

// -----  ----- //

proto.setType = function( type ) {
  for ( var index in this.tones ) {
    var tone = this.tones[ index ];
    tone.osc.type = type;
  }
};
