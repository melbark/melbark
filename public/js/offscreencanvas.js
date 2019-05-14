

onmessage = function(evt,myAudioAnalyser) {
    
    // var el = document.getElementById("content1")

    const canvas = evt.data.canvas;
    const ctx = canvas.getContext("2d");

    // var ctx = gl.getContext("2d");
  
    function render(time) {
        var array = new Uint8Array(myAudioAnalyser.frequencyBinCount);
         myAudioAnalyser.getByteFrequencyData(array);

        // var el = document.getElementsByTagName("canvas")[0];
        // var ctx = el.getContext("2d");
  
        // var vizCanvas = document.getElementById("speccanvas");
        // var vizCanvas = document.getElementsByTagName("canvas")[0];
        // var ctxosc1 = vizCanvas.getContext("2d");
        // ctxosc1.clearRect(0, 0, 2048, 250);
        tempCtx.drawImage(canvas, 0, 0, 2048, 1000);
          // iterate over the elements from the array
        var arrayLength = array.length
        for (var i = 0; i < arrayLength; i++) {
            // draw each pixel with the specific color
            var value = array[i];
            ctx.fillStyle = hot.getColor(value).hex();
            a = pxmult * frequencty_to_px(i)
            c = pxmult * frequencty_to_px(i+1)-pxmult * frequencty_to_px(i)
            // ctxosc1.fillStyle = ctx.fillStyle;
            // ctxosc1.fillRect(a, 250 - 1*value,c, value);
            ctx.fillRect(a, 1000 - 1,c , 1);
         
            //ctx.fillRect(10*i, 600 - 1, .1, 5);
          }
          
          ctx.translate(0, -1);
          // draw the copied image
          ctx.drawImage(tempCanvas, 0, 0, 2048, 1000, 0, 0, 2048, 1000);
          // reset the transformation matrix
          ctx.setTransform(1, 0, 0, 1, 0, 0);
   
          

      // ... some drawing using the gl context ...
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  };



  message = function(evt) {
    const canvas = evt.data.canvas;
    const gl = canvas.getContext("webgl");
  
    function render(time) {
      // ... some drawing using the gl context ...
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  };

