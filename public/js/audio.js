// function drawSpectrum() {
//     audio.analyser.getByteFrequencyData(audio.frequencyData);
//     var e = Math.ceil(canvas.width / (0.85 * audio.analyser.frequencyBinCount));
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     var o,
//     a,
//     i,
//     t,
//     n;
//     ctx.fillStyle = ctx.createPattern(img, 'repeat');
//     for (var u = 0; u < audio.analyser.frequencyBinCount; u++) o = audio.frequencyData[u] || 0,
//     a = e * u,
//     a + e < canvas.width && (i = canvas.height, t = e - 1, n = - (Math.floor(o / 255 * canvas.height) + 1), ctx.fillRect(a, i, t, n));
//     audio.pause_vis ? ctx.clearRect(0, 0, canvas.width, canvas.height)  : requestAnimationFrame(drawSpectrum)
//   }
  var audio = {
    analyser: {
    },
    buffer: {
    },
    buffer_effects: {
    },
    compatibility: {
    },
    convolver: {
    },
    effects: [
        'http://40.115.69.186:3000/files/1.mp3',
        'http://40.115.69.186:3000/files/2.mp3',
        'http://40.115.69.186:3000/files/3.mp3'
    ],
    files: [
      name,
      files[0],
      samples[2]
    ],
    frequencyData: {
    },
    gain: {
    },
    gain_loop: {
    },
    gain_once: {
    },
    message: {
      quote: [
        'I like audio loops... better than I like you.<br>~ Dr. McCoy to Spock',
        'There is the theory of the mobius, a twist in the fabric of space where time becomes a loop...<br>~ Worf',
        'Hey doll, is this audio boring you? Come and talk to me. I\'m from a different planet.<br>~ Zaphod Beeblebrox',
        'I need your headphones, your record player and your glowsticks.<br>~ Arnold Schwarzenegger',
        'I\'m the synthesizer. Are you the keymaster?<br>~ Sigourney Weaver',
        'Flash? Where we\'re going, we don\'t need flash.<br>~ Doc Brown',
        'I\'ll be history.back()<br>~ Arnold Schwarzenegger',
        'I don\'t want one loop, I want all loops!<br>~ Ruby Rhod',
        'If it reads, we can stream it.<br>~ Arnold Schwarzenegger'
      ],
      quote_last: - 1
    },
    pause_vis: !0,
    playing: 0,
    proceed: !0,
    source_loop: {
    },
    source_once: {
    },
    volume_fade_time: 0.7
  };
  audio.findSync = function (e) {
    var o = 0,
    a = 0,
    i = 0;
    for (var t in audio.source_loop) a = audio.source_loop[t]._startTime,
    a > 0 && (o > a || 0 === o) && (o = a);
    if (audio.context.currentTime > o) {
      var n = audio.buffer[e].duration;
      i = (audio.context.currentTime - o) % n
    }
    return i
  },
  audio.message.random = function () {
    var e;
    do e = Math.floor(Math.random() * audio.message.quote.length);
    while (e === audio.message.quote_last);
    return audio.message.quote_last = e,
    audio.message.quote[e]
  },
  audio.play = function (e, o) {
    if (audio.source_loop[e]._playing) o || audio.stop(e);
     else {
      audio.source_loop[e] = audio.context.createBufferSource(),
      audio.source_loop[e].buffer = audio.buffer[e],
      audio.source_loop[e].connect(audio.gain_loop[e]),
      audio.source_loop[e].loop = !0;
      var a = audio.findSync(e);
      audio.source_loop[e]._startTime = audio.context.currentTime,
      'noteOn' === audio.compatibility.start ? (audio.source_once[e] = audio.context.createBufferSource(), audio.source_once[e].buffer = audio.buffer[e], audio.source_once[e].connect(audio.gain_once[e]), audio.source_once[e].noteGrainOn(0, a, audio.buffer[e].duration - a), audio.gain_once[e].gain.setValueAtTime(0, audio.context.currentTime), audio.gain_once[e].gain.linearRampToValueAtTime(1, audio.context.currentTime + audio.volume_fade_time), audio.source_loop[e][audio.compatibility.start](audio.context.currentTime + (audio.buffer[e].duration - a)))  : audio.source_loop[e][audio.compatibility.start](0, a),
      audio.gain_loop[e].gain.setValueAtTime(0, audio.context.currentTime),
      audio.gain_loop[e].gain.linearRampToValueAtTime(1, audio.context.currentTime + audio.volume_fade_time),
      document.getElementById('button-loop-' + e).className = 'active',
      audio.source_loop[e]._playing = !0,
      audio.playing = audio.playing + 1,
      1 === audio.playing && (audio.pause_vis = !1, jQuery('.widget-vis p').stop().fadeOut(1500, function () {
        jQuery(this).html(audio.message.random())
      }))
    }
  },
  audio.playAll = function () {
    for (var e in audio.source_loop) audio.play(e, !0)
    // for (var e in samples) e.start()
    // samples
  },
  audio.stop = function (e) {
    audio.source_loop[e]._playing && !audio.source_loop[e]._stopping && (audio.source_loop[e]._stopping = !0, audio.source_loop[e][audio.compatibility.stop](audio.context.currentTime + audio.volume_fade_time), audio.source_loop[e]._startTime = 0, 'noteOn' === audio.compatibility.start && (audio.source_once[e][audio.compatibility.stop](audio.context.currentTime + audio.volume_fade_time), audio.gain_once[e].gain.setValueAtTime(1, audio.context.currentTime), audio.gain_once[e].gain.linearRampToValueAtTime(0, audio.context.currentTime + audio.volume_fade_time)), function () {
      var o = e;
      setTimeout(function () {
        audio.source_loop[o]._playing = !1,
        audio.source_loop[o]._stopping = !1
      }, 100 * audio.volume_fade_time)
    }(), audio.gain_loop[e].gain.setValueAtTime(1, audio.context.currentTime), audio.gain_loop[e].gain.linearRampToValueAtTime(0, audio.context.currentTime + audio.volume_fade_time), document.getElementById('button-loop-' + e).className = 'inactive', audio.playing = audio.playing - 1, 0 === audio.playing && setTimeout(function () {
      0 === audio.playing && (audio.pause_vis = !0, jQuery('.widget-vis p').stop().fadeIn(3000))
    }, 5000))
  },
  audio.stopAll = function () {
    for (var e in audio.source_loop) audio.stop(e)
  };
  try {
    // window.AudioContext = window.AudioContext || window.webkitAudioContext,
    audio.context = context
  } catch (e) {
    audio.proceed = !1,
    alert('Web Audio API not supported in this browser.')
  }
  if (audio.proceed) {
    !function () {
      var e = 'createGain';
      'function' != typeof audio.context.createGain && (e = 'createGainNode'),
      audio.compatibility.createGain = e
    }(),
    function () {
      var e = 'start',
      o = 'stop',
      a = audio.context.createBufferSource();
      'function' != typeof a.start && (e = 'noteOn'),
      audio.compatibility.start = e,
      'function' != typeof a.stop && (o = 'noteOff'),
      audio.compatibility.stop = o
    }();
    // var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
    // window.requestAnimationFrame = requestAnimationFrame,
    audio.gain.booster = audio.context[audio.compatibility.createGain](),
    audio.gain.booster.gain.value = 3,
    audio.convolver = audio.context.createConvolver(),
    audio.convolver.connect(audio.gain.booster),
    audio.gain.collapse = audio.context[audio.compatibility.createGain]();
    // var img = new Image;
    // img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAEklEQVR4AWNsP/eaATcYlcYKANQJFotqqVYoAAAAAElFTkSuQmCC';
    // var canvas_div = document.getElementById('vis-div'),
    // canvas = document.getElementById('vis');
    // canvas.height = canvas_div.offsetHeight,
    // canvas.width = canvas_div.offsetWidth;
    // // var ctx = canvas.getContext('2d');
    // ctx.imageSmoothingEnabled = !1,
    // ctx.webkitImageSmoothingEnabled = ctx.mozImageSmoothingEnabled = !1,
    // audio.analyser = audio.context.createAnalyser(),
    // audio.analyser.smoothingTimeConstant = 0.85,
    // audio.analyser.fftSize = 256,
    // audio.frequencyData = new Uint8Array(audio.analyser.frequencyBinCount),
    jQuery('#master-volume').prop('disabled', !1).knob({
      angleArc: 360,
      angleOffset: 0,
      displayInput: !0,
      height: 104,
      thickness: '.2',
      width: 104,
      change: function (e) {
        e /= 100,
        audio.gain.master.gain.value = e * e
      }
    }),
    audio.gain.master = audio.context[audio.compatibility.createGain](),
    audio.gain.master.gain.value = 0.8649,
    audio.gain.master.connect(myAudioAnalyser),
    audio.gain.master.connect(audio.context.destination),
    audio.gain.collapse.connect(audio.gain.master),
    jQuery('.widget-effects').delegate('button', 'click', function (e) {
      var o = parseInt(this.value);
      audio.gain.collapse.disconnect(),
      audio.gain.booster.disconnect();
      var a = audio.gain.master.gain.value;
      audio.gain.master.gain.value = 0,
      'active' === this.className ? (jQuery('.widget-effects .active').removeClass('active'), audio.gain.collapse.connect(audio.gain.master))  : (jQuery('.widget-effects .active').removeClass('active'), audio.convolver.buffer = audio.buffer_effects[o], audio.gain.collapse.connect(audio.convolver), audio.gain.booster.connect(audio.gain.master), this.className = 'active'),
      setTimeout(function () {
        audio.gain.master.gain.value = a
      }, 50)
    }),
    document.getElementById('button-stop').addEventListener('click', audio.stopAll),
    document.getElementById('button-stop').disabled = !1,
    document.getElementById('button-play').addEventListener('click', audio.playAll),
    document.getElementById('button-play').disabled = !1;
    for (var a in audio.files) !function () {
      var e = parseInt(a) + 1,
      o = new XMLHttpRequest;
      o.open('GET', audio.files[e - 1], !0),
      o.responseType = 'arraybuffer',
      o.onload = function () {
        audio.context.decodeAudioData(o.response, function (o) {
          audio.buffer[e] = o,
          audio.source_loop[e] = {
          };
          var a = document.getElementById('button-loop-' + e);
          a.addEventListener('click', function (e) {
            e.preventDefault(),
            audio.play(this.value, !1)
          }),
          jQuery(a).text(a.getAttribute('data-name')).removeClass('loading'),
          a.disabled = !1,
          audio.gain_loop[e] = audio.context[audio.compatibility.createGain](),
          audio.gain_loop[e].connect(audio.gain.collapse),
          'noteOn' === audio.compatibility.start && (audio.gain_once[e] = audio.context[audio.compatibility.createGain](), audio.gain_once[e].connect(audio.gain.collapse))
        }, function () {
          console.log('Error decoding audio "' + audio.files[e - 1] + '".')
        })
      },
      o.send()
    }();
    for (var a in audio.effects) !function () {
      var e = parseInt(a) + 1,
      o = new XMLHttpRequest;
      o.open('GET', audio.effects[e - 1], !0),
      o.responseType = 'arraybuffer',
      o.onload = function () {
        audio.context.decodeAudioData(o.response, function (o) {
          audio.buffer_effects[e] = o;
          var a = document.getElementById('effect-' + e);
          a.disabled = !1,
          jQuery(a).html(a.getAttribute('data-name').replace(' ', '<br>')).removeClass('loading')
        }, function () {
          console.log('Error decoding effect "' + audio.effects[e - 1] + '".')
        })
      },
      o.send()
    }();
    // jQuery(document).ready(function () {
    //   jQuery(window).resize(function () {
    //     canvas.height = canvas_div.offsetHeight,
    //     canvas.width = canvas_div.offsetWidth
    //   })
    // })
  }