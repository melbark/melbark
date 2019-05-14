function getNoteIndex( note ) {
  var noteNameIndex = 'CDEFGAB'.indexOf( note[0] );
  var octaveIndex = parseInt( note[1], 10 ) - 4;
  return octaveIndex * 7 + noteNameIndex;
}

function getNoteFromNumber( index ) {
  var octave = Math.floor( index / 7 ) + 4;
  var noteName = 'CDEFGAB'[ modulo( index, 7 ) ];
  return noteName + octave;
}

function modulo( num, div ) {
  return ( ( num % div ) + div ) % div;
}
