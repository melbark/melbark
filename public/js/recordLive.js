var volume,
    volumeLevel = 0,
    currentEditedSoundIndex;



  //volume.gain.value = volumeLevel;

function startUserMedia(stream) {
  //var input = context.createMediaStreamSource(stream);
  //input.connect(systemvolume)

  console.log('Input connected to audio context destination.');
  systemvolume.connect(context.destination)
  // recorder = new Recorder(systemvolume);
  console.log('Recorder initialised.');
}


function newRecorder() {
  //var input = context.createMediaStreamSource(stream);
  //input.connect(systemvolume)

  //recorder = new Recorder(systemvolume);
  console.log('Recorder initialised.');
}


function changeVolume(value) {
  if (!volume) return;
  volumeLevel = value;
  volume.gain.value = value;
}

function startRecording(button) {
  recorder && recorder.record();
  button.disabled = true;
  button.nextElementSibling.disabled = false;
  console.log('Recording...');
}

function stopRecording(button) {
  recorder && recorder.stop();
  button.disabled = true;
  button.previousElementSibling.disabled = false;
  console.log('Stopped recording.');
  
  // create WAV download link using audio data blob
  createDownloadLink();
  
  recorder.clear();
}

function createDownloadLink() {
  currentEditedSoundIndex = -1;
  recorder && recorder.exportWAV(handleWAV.bind(this));
}

function handleWAV(blob) {
  var tableRef = document.getElementById('recordingslist');
  if (currentEditedSoundIndex !== -1) {
    $('#recordingslist tr:nth-child(' + (currentEditedSoundIndex + 1) + ')').remove();
  }

  var url = URL.createObjectURL(blob);
  var newRow   = tableRef.insertRow(currentEditedSoundIndex);
  newRow.className = 'soundBite';
  var audioElement = document.createElement('audio');
  var downloadAnchor = document.createElement('a');
  var editButton = document.createElement('button');
  
  audioElement.controls = true;
  audioElement.src = url;

  downloadAnchor.href = url;
  downloadAnchor.download = new Date().toISOString() + '.wav';
  downloadAnchor.innerHTML = 'Download';
  downloadAnchor.className = 'btn btn-primary';

  editButton.onclick = function(e) {
      // $('.recorder.container').removeClass('hide');
   // $('.recorder.container').addClass('hide');
   // $('.editor.container').removeClass('invisible');

    currentEditedSoundIndex = $(e.target).closest('tr').index();
    
    var f = new FileReader();
    f.onload = function(e) {
        audio_context.decodeAudioData(e.target.result, function(buffer) {
          console.warn(buffer);
          $('#audioLayerControl')[0].handleAudio(buffer);
        }, function(e) {
          console.warn(e);
        });
    };
    f.readAsArrayBuffer(blob);
  };
  editButton.innerHTML = 'Edit';
  editButton.className = 'btn btn-primary';

  var newCell = newRow.insertCell(-1);
  newCell.appendChild(audioElement);
  newCell = newRow.insertCell(-1);
  newCell.appendChild(downloadAnchor);
  newCell = newRow.insertCell(-1);
  newCell.appendChild(editButton);

  newCell = newRow.insertCell(-1);
  var toggler;
  for (var i = 0, l = 8; i < l; i++) {
    toggler = document.createElement('input');
    $(toggler).attr('type', 'checkbox');
    newCell.appendChild(toggler);
    
var myAudio = document.querySelector(toggler);

// Create a MediaElementAudioSourceNode
// Feed the HTMLMediaElement into it
var sourcehtml = context.createMediaElementSource(myAudio);
// Create a gain node
var gainNodehtml = context.createGain();
// Create variables to store mouse pointer Y coordinate
// and HEIGHT of screen

// Get new mouse pointer coordinates when mouse is moved
// then set new gain value

// connect the AudioBufferSourceNode to the gainNode
// and the gainNode to the destination, so we can play the
// music and adjust the volume using the mouse cursor
sourcehtml.connect(systemvolume);
// systemvolume.connect(myAudioAnalyser)
// systemvolume.connect(context.destination);
  }
}
