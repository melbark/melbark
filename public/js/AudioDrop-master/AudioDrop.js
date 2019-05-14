function AudioDrop(options) {

  if(!options.context) {
    return console.error('Please supply AudioDrop with a `context` option.');
  }
  if(!options.elements) {
    return console.error('Please supply AudioDrop with an `elements` option.');
  }
  if(!options.drop) {
    return console.error('Please supply AudioDrop with a `drop` option.');
  }

  if(!options.sampleno) {
    return console.error('Please supply AudioDrop with a `sampleno` option.');
  }

  if(!options.looptype) {
    return console.error('Please supply AudioDrop with a `sampleno` option.');
  }

  if(!Array.isArray(options.elements)) {
    options.elements = [options.elements];
  }

  // ==========================================
  // Event Binding
  // ==========================================

  // we want to prevent the default behavior for window drops
  window.addEventListener('dragleave', preventDefault, false);
  window.addEventListener('dragover', preventDefault, false);
  window.addEventListener('drop', preventDefault, false);
  // window.addEventListener('pointermove', preventDefault, false);
  // window.addEventListener('pointerup', preventDefault, false);
  // window.addEventListener('pointerdown', preventDefault, false);
  // window.addEventListener('pointermove', preventDefault, false);
  // window.addEventListener('pointerup', preventDefault, false);
  // window.addEventListener('pointerdown', preventDefault, false);

  // create events for each element passed in
  options.elements.forEach( function(element) {
    element.addEventListener('dragenter', dragEnter, false);
    element.addEventListener('dragover', dragOver, false);
    element.addEventListener('dragleave', dragLeave, false);
    element.addEventListener('drop', drop, false);
    element.addEventListener('pointerdown', playsample, false);
    element.addEventListener('pointerup', stopsample, false);
    element.addEventListener('pointerleave', stopsample, false);
    element.addEventListener('pointercancel', stopsample, false);
    element.addEventListener('touchdown', playsample, false);
    element.addEventListener('touchup', stopsample, false);
    // element.addEventListener('pointermove', preventDefault, false);
    // element.addEventListener('touchup', preventDefault, false);
    // element.addEventListener('pointerdown', preventDefault, false);
    // element.addEventListener('pointerup', preventDefault, false);
  });

  // ==========================================
  // Events
  // ==========================================

  

  

  function playsample(e) {


    
    e.stopPropagation();
    e.preventDefault();
    var now = context.currentTime;
    // turn off global dragging flag
    // dragging = false;
    // start looping to find audio files & folders
      // options.context.decodeAudioData(arraybuffer, function (buffer) {
      // source = options.context.createBufferSource();
      // source.connect(systemvolume)
   

      
    if (options.looptype == "short") {
      window["source" + options.sampleno] = options.context.createBufferSource();
      window["sourcegain" + options.sampleno] = options.context.createGain();
      window["source" + options.sampleno].connect( window["sourcegain" + options.sampleno]);
      window["sourcegain" + options.sampleno].connect(mastervolume);

      window["source" + options.sampleno].buffer = samples[options.sampleno];
      window["sourcegain" + options.sampleno].gain.cancelScheduledValues( now );
      window["sourcegain" + options.sampleno].gain.setValueAtTime(0, now)
      window["sourcegain" + options.sampleno].gain.linearRampToValueAtTime(1, now+.1);

    
      window["source" + options.sampleno].loop = false;
      
      window["source" + options.sampleno].start(0);


    } 

    else if (options.looptype == "loop") {
      window["source" + options.sampleno] = options.context.createBufferSource();
      window["sourcegain" + options.sampleno] = options.context.createGain();
      window["source" + options.sampleno].connect( window["sourcegain" + options.sampleno]);
      window["sourcegain" + options.sampleno].connect(mastervolume);

      window["source" + options.sampleno].buffer = samples[options.sampleno];
      window["sourcegain" + options.sampleno].gain.cancelScheduledValues( now );
      window["sourcegain" + options.sampleno].gain.setValueAtTime(0, now)
      window["sourcegain" + options.sampleno].gain.linearRampToValueAtTime(1, now+.1);


      window["source" + options.sampleno].loop = true;
      
      window["source" + options.sampleno].start(0);


    }
    if (options.looptype == "noloop") {
      window["source" + options.sampleno] = options.context.createBufferSource();
      window["sourcegain" + options.sampleno] = options.context.createGain();
      window["source" + options.sampleno].connect( window["sourcegain" + options.sampleno]);
      window["sourcegain" + options.sampleno].connect(mastervolume);

      window["source" + options.sampleno].buffer = samples[options.sampleno];
      window["sourcegain" + options.sampleno].gain.cancelScheduledValues( now );
      window["sourcegain" + options.sampleno].gain.setValueAtTime(0, now)
      window["sourcegain" + options.sampleno].gain.linearRampToValueAtTime(1, now+.1);

    
      window["source" + options.sampleno].loop = false;
      
      window["source" + options.sampleno].start(0);


    } 
    else if (options.looptype == "complete") {
      // window["source" + options.sampleno].isplaying = !0;
  
    console.log(typeof window["source" + options.sampleno])
    
   
     if (typeof window["source" + options.sampleno] === 'undefined' ){
        window["source" + options.sampleno] = options.context.createBufferSource();
        window["sourcegain" + options.sampleno] = options.context.createGain();
        window["source" + options.sampleno].connect( window["sourcegain" + options.sampleno]);
        window["sourcegain" + options.sampleno].connect(mastervolume);
  
        window["source" + options.sampleno].buffer = samples[options.sampleno];
        window["sourcegain" + options.sampleno].gain.cancelScheduledValues( now );
        window["sourcegain" + options.sampleno].gain.setValueAtTime(0, now)
        window["sourcegain" + options.sampleno].gain.linearRampToValueAtTime(1, now+.1);
  
        window["source" + options.sampleno].loop = true;
        window["source" + options.sampleno].start(0);
        window["source" + options.sampleno].isplaying = 1;
        console.log(window["source" + options.sampleno].isplaying)


      }

      else if (window["source" + options.sampleno].loop == true ) {
        window["sourcegain" + options.sampleno].gain.cancelScheduledValues( now );
        window["sourcegain" + options.sampleno].gain.setValueAtTime(window["sourcegain" + options.sampleno].gain.value, now)     ;
              
        window["sourcegain" + options.sampleno].gain.linearRampToValueAtTime(0, now +.1)     ;         
           
        window["source" + options.sampleno].stop(now + .1);
        window["source" + options.sampleno].loop = false;
        window["source" + options.sampleno].isplaying = 0;
        console.log(window["source" + options.sampleno].loop)
        console.log("source")
      }

      else if  (typeof window["source" + options.sampleno] === 'object') {
        window["source" + options.sampleno] = options.context.createBufferSource();
        window["sourcegain" + options.sampleno] = options.context.createGain();
        window["source" + options.sampleno].connect( window["sourcegain" + options.sampleno]);
        window["sourcegain" + options.sampleno].connect(mastervolume);
  
        window["source" + options.sampleno].buffer = samples[options.sampleno];
        window["sourcegain" + options.sampleno].gain.cancelScheduledValues( now );
        window["sourcegain" + options.sampleno].gain.setValueAtTime(0, now)
        window["sourcegain" + options.sampleno].gain.linearRampToValueAtTime(1, now+.1);
        window["source" + options.sampleno].loop = true;
        window["source" + options.sampleno].start(0);
        window["source" + options.sampleno].isplaying = 1;


      }
     

      


    }
      
     
     
    // });
     return false;
  }


  
  function stopsample(e) {
    // var samples = []
    e.stopPropagation();
    e.preventDefault();
    // var source
    // turn off global dragging flag
    // dragging = false;
    var now = context.currentTime;
    // window["sourcegain" + options.sampleno].gain.linearRampToValueAtTime(0,now+ 10);
    // window["source" + options.sampleno].stop();
    // window["source" + options.sampleno].onended = function() {

    //   window["source" + options.sampleno].disconnect();

    if (options.looptype == "short") {
      window["sourcegain" + options.sampleno].gain.cancelScheduledValues( now );
      window["sourcegain" + options.sampleno].gain.setValueAtTime(window["sourcegain" + options.sampleno].gain.value, now)     ;
            
      window["sourcegain" + options.sampleno].gain.linearRampToValueAtTime(0, now +.1)     ;         
         
      window["source" + options.sampleno].stop(now + .1);


    } 

    else if (options.looptype == "loop") {
      window["sourcegain" + options.sampleno].gain.cancelScheduledValues( now );
      window["sourcegain" + options.sampleno].gain.setValueAtTime(window["sourcegain" + options.sampleno].gain.value, now)     ;
            
      window["sourcegain" + options.sampleno].gain.linearRampToValueAtTime(0, now +.1)     ;         
         
      // window["source" + options.sampleno].stop(now + .1);
    


    }

    else if (options.looptype == "noloop") {



    } 

    
    else if (options.looptype == "complete") {



    } 

    else  {
      // window["sourcegain" + options.sampleno].gain.cancelScheduledValues( now );
      // window["sourcegain" + options.sampleno].gain.setValueAtTime(window["sourcegain" + options.sampleno].gain.value, now)     ;
            
      // window["sourcegain" + options.sampleno].gain.linearRampToValueAtTime(0, now +.1)     ;         
      // window["source" + options.sampleno].loop = false;   
      // window["source" + options.sampleno].stop(now + .1);


    }

      // window["sourcegain" + options.sampleno].gain.cancelScheduledValues( now );
      // window["sourcegain" + options.sampleno].gain.setValueAtTime(window["sourcegain" + options.sampleno].gain.value, now)     ;
            
      // window["sourcegain" + options.sampleno].gain.linearRampToValueAtTime(0, now +.1)     ;         
         
      // window["source" + options.sampleno].stop(now + .1);
      // window["source" + options.sampleno].onended = function() {
      //   window["source" + options.sampleno].disconnect();
      
    //   //console.log("clean up tone")
 
    // window["source" + options.sampleno].stop(0);
   
    // });
    return false;
  }


  function drop(e) {
    e.stopPropagation();
    e.preventDefault();
    // turn off global dragging flag
    dragging = false;
    // start looping to find audio files & folders
    var droppedFiles = Array.prototype.slice.call(e.dataTransfer.files);
    droppedFiles.forEach( function(file) {
      if(isSupportedFormat(file.type)) {
        decodeBuffer(file);
    
        // samples[0] = decodeBuffer(file)
        // console.log(this.samples)
      }
    });
    return false;
  }

  function dragEnter(e) {
    options.dragEnter && options.dragEnter(e);
  }

  function dragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    options.dragOver && options.dragOver(e);
  }

  function dragLeave(e) {
    e.stopPropagation();
    e.preventDefault();
    options.dragLeave && options.dragLeave(e);
  }

  function preventDefault(e) {
    e.preventDefault();
  }

  // ==========================================
  // Audio
  // ==========================================

  function decodeBuffer(file) {
    var fileReader = new FileReader();

    fileReader.onload = function(fileEvent) {
      var data = fileEvent.target.result;
      console.log(fileEvent.target.result)
      options.context.decodeAudioData(data, function(buffer) {
        options.drop(buffer, file);
      }, function(e) {
        console.error('There was an error decoding ' + file.name);
      });
    };

    fileReader.readAsArrayBuffer(file);
  }

  function isSupportedFormat(type) {
    return type.indexOf('audio') > -1;
  }
}

AudioDrop.isValidVariableName = function(str) {
  return !str.match(/^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|null|this|true|void|with|break|catch|class|const|false|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof|undefined)$/);
};


