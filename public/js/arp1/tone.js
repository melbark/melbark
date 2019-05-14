
function Tone( keyboardKey ) {
  this.keyboardKey = keyboardKey;
  this.audio = keyboardKey.audio;
  var voice = keyboardKey.voice;
  var osc = this.audio.createOscillator();
  osc.frequency.value = 440;

// lue = voice.detune;

  var output = this.audio.createGain();
  output.gain.value = 0;

  osc.type = voice.type;
  osc.connect( output );

  osc.start();

  this.osc = osc;
  this.output = output;

  this.isPlaying = false;
  // hash of ramps
  this.ramps = {};
}

var proto = Tone.prototype;

// -----  ----- //

proto.play = function() {
  // attack time per beat
  var attack = settings.attackTime * settings.beatTime / 1000;
  this.rampGain( 1, attack );
};

proto.stop = function() {
  // full release will cover 7 beats
  var release = settings.releaseTime * settings.beatTime / 1000 * 7;
  this.rampGain( 0, release );
};

// ----- rampGain ----- //

proto.rampGain = function( value, duration ) {
  this.rampParam( this.output.gain, 'gain', value, duration, 0 );
};

proto.rampParam = function( param, rampName, value, duration, defaultValue ) {
  var now = this.audio.currentTime;
  // get current value
  var currentValue = defaultValue;
  var ramp = this.ramps[ rampName ];
  if ( ramp ) {
    // calc time since last, decimal 0..1
    var time = ramp.duration ?
      Math.min( 1, ( now - ramp.then ) / ramp.duration ) : 1;
    currentValue = lerp( ramp.from, ramp.to, time );
  }

  param.cancelScheduledValues( now );
  param.setValueAtTime( currentValue, now );
  param.linearRampToValueAtTime( value, now + duration );

  this.ramps[ rampName ] = {
    then: now,
    duration: duration,
    from: currentValue,
    to: value
  };

};

function lerp( a, b, t ) {
  return ( b - a ) * t + a;
}
