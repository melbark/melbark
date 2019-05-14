/* globals Instrument, ArpBoard, ArpButton, customArps, saveCustomArps */

// -------------------------- arp buttons -------------------------- //

var defaultArps = [
  [0,4,7,0,4,7,0,7],
  [0,2,4,6,7,6,4,2],
  [0,0,7,7,0,0,7,7],
  [0,2,0,4,0,2,0,7],
  [0,3,5,7,3,0,5,7],
  [7,6,4,1,7,6,4,1],
  [0,-2,0,-2,0,4,0,4],
  [7,5,3,0,-2,0,3,5],
];

var arpButtons = [];

defaultArps.forEach( function( arp ) {
  var arpButton = new ArpButton( arp );
  arpButtons.push( arpButton );
});

customArps.forEach( function( arp ) {
  var arpButton = new ArpButton( arp, true );
  arpButtons.push( arpButton );
});

// -------------------------- arp boards -------------------------- //

var arpBoardContainer = document.querySelector('.arp-board-container');
var arpBoard0 = new ArpBoard( arpBoardContainer );

arpBoard0.onArpeggioSet = function() {
  localStorage.setItem( 'arpeggio', JSON.stringify( arpBoard0.arpeggio ) );
};

// set initial arpeggio
var initArp = localStorage.getItem('arpeggio');
initArp = initArp ? JSON.parse( initArp ) : defaultArps[0];
arpBoard0.setArpeggio( initArp );

// -------------------------- addArpButton -------------------------- //

var addArpButton = document.createElement('button');
addArpButton.className = 'add-arp-button';
addArpButton.textContent = 'Add to list';

addArpButton.onclick = function() {
  var arp = arpBoard0.arpeggio;
  var arpButton = new ArpButton( arp, true );
  arpButtons.push( arpButton );
  customArps.push( arp );
  saveCustomArps();
};

arpBoardContainer.appendChild( addArpButton );

// -------------------------- synth -------------------------- //

var syntharp = new Instrument();

/**/
syntharp.addVoice({
  type: 'square',
  volume: 0.1
});

syntharp.addVoice({
  type: 'square',
  volume: 0.1,
  octaveOffset: -1,
  detune: -5
});

var filterA = syntharp.createFilter();
var filterB = syntharp.createFilter();
filterA.type = 'lowpass';
filterB.type = 'lowpass';

syntharp.output.connect( filterA );
filterA.connect( filterB );
var end = filterB;
// end.connect( syntharp.destination );



// -------------------------- option inputs -------------------------- //

var attackRange = document.querySelector('.attack-range');
var onAttackRangeInput = attackRange.oninput = function() {
  settings.attackTime = parseFloat( attackRange.value );
};

onAttackRangeInput();

var releaseRange = document.querySelector('.release-range');
var onReleaseRangeInput = releaseRange.oninput = function() {
  settings.releaseTime = parseFloat( releaseRange.value );
};

onReleaseRangeInput();

var filterRange = document.querySelector('.filter-range');
var onFilterRangeInput = filterRange.oninput = function() {
  var value = parseFloat( filterRange.value );
  filterA.frequency.value = value * value * 20000;
  filterB.frequency.value = value * value * 20000;
};
onFilterRangeInput();


var resRange = document.querySelector('.res-range');
var onResRangeInput = resRange.oninput = function() {
  var res = parseFloat( resRange.value );
  // ^4 * 20 + 1 for some reason, from https://www.resistorsings.com/106/
  res = res * res * res * res * 15 + 1;
  filterA.Q.value = res;
  filterB.Q.value = res;
};
onResRangeInput();

var bpmRange = document.querySelector('.bpm-range');
var onBpmRangeInput = bpmRange.oninput = function() {
  var bpm = parseInt( bpmRange.value, 10 );
  settings.beatTime = 60 * 1000 / ( bpm * 2 );
};
onBpmRangeInput();

var holdRange = document.querySelector('.hold-range');
var onHoldRangeInput = holdRange.oninput = function() {
  settings.holdTime = parseFloat( holdRange.value );
};
onHoldRangeInput();

var shapeSelect = document.querySelector('.shape-select');
var onShapeSelectChange = shapeSelect.onchange = function() {
  syntharp.voices[0].setType( shapeSelect.value );
  syntharp.voices[1].setType( shapeSelect.value );
};

onShapeSelectChange();

var arpvolume = context.createGain();
arpvolume.gain.value = 0.9999
// arpvolume.connect(mastervolume)

// -------------------------- visualizer -------------------------- //

// var vizCanvas = document.querySelector('.viz-canvas');
// var canvasWidth = vizCanvas.width = window.innerWidth - 20;
// var canvasHeight = vizCanvas.height = 200;
// var ctx = vizCanvas.getContext('2d');

// var analyzer = syntharp.audio.createAnalyser();











end.connect(mastervolume);
// arpvolume.connect(inputcabinet);
// inputcabinet.connect(inputfilter);
// inputfilter.connect(inputchorus);
// inputchorus.connect(inputtremolo);
// inputtremolo.connect(inputphaser);
// inputphaser.connect(inputdelay);
// inputdelay.connect(arpvolume)
// arpvolume.connect( mastervolume );











// systemvolume.connect( myAudioAnalyser );

// analyzer.minDecibels = -90;
// analyzer.maxDecibels = -10;
// analyzer.smoothingTimeConstant = 0.8;

// analyzer.fftSize = 4096;
// var bufferLength = analyzer.frequencyBinCount;
// var dataArray = new Uint8Array( bufferLength );

// ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
// ctx.fillStyle = 'white';
// ctx.fillRect( 0, 0, canvasWidth, canvasHeight );

// function render() {
//   analyzer.getByteFrequencyData( dataArray );

//   // shift down
//   var canvasImageData = ctx.getImageData( 0, 0, canvasWidth, canvasHeight );
//   ctx.putImageData( canvasImageData, 0, 6 );

//   ctx.fillStyle = 'black';
//   ctx.fillRect( 0, 0, canvasWidth, canvasHeight );

//   var barWidth = Math.ceil( canvasWidth / bufferLength);

//   for ( var i = 0; i < bufferLength; i++ ) {
//     var x = Math.floor( i * barWidth );
//     var amp = dataArray[i] / 256; // should be 256
//     var hue = Math.round( amp * 210 + 210 );
//     // var sat = 50 + ( 1- amp) * 50;
//     // var alpha = amp;
//     ctx.fillStyle = 'hsla(' + hue + ', 100%, ' + 50 + '%, ' + 1 + ')';
//     var barHeight = amp * canvasHeight;
//     var y = canvasHeight - barHeight;
//     ctx.fillRect( x, y, barWidth, barHeight );
//   }

//   requestAnimationFrame( render );
// }

// render();
