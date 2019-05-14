
 var fx, inst1;
var oscilloscope, piano;

// Unfocus the textbox
function blurAll() {
  var tmp = document.createElement("input");
  document.body.appendChild(tmp);
  tmp.focus();
  document.body.removeChild(tmp);
}

function initNexus() {
  Nexus.context = Tone.context;
  let poly = ["AMSynth", "DuoSynth", "FMSynth", "MonoSynth", "Synth"];

  oscilloscope = new Nexus.Oscilloscope("#osci", {
    size: [window.innerWidth - 708, 53]
  });
  oscilloscope.colorize("fill", "#000");
  oscilloscope.colorize("accent", "#3480bf");
  oscilloscope.connect(Tone.Master);

  let meter = new Nexus.Meter("#meter", {
    size: [10, 53]
  });
  meter.colorize("fill", "#000");
  meter.colorize("accent", "#3480bf");
  meter.connect(Tone.Master);

  piano = new Nexus.Piano("#piano", {
    size: [window.innerWidth, window.innerHeight / 15],
    mode: "button", // 'button', 'toggle', or 'impulse'
    lowNote: 0,
    highNote: 120
  });
  piano.colorize("accent", "#55b0e7");
  piano.colorize("fill", "#66b0e7");

  piano.on("change", v => {
    if (v.state && inst1.synth) {
      // the triggerAttack is different for Metal and Noise Synths
      if (
        inst1.controls.synthType == "MetalSynth" ||
        inst1.controls.synthType == "NoiseSynth"
      ) {
        inst1.synth.triggerAttack();
      } else {
        inst1.synth.triggerAttack(Tone.Frequency(v.note, "midi").toNote());
      }
    } else if (poly.includes(inst1.controls.synthType)) {
      inst1.synth.triggerRelease(Tone.Frequency(v.note, "midi").toNote());
    } else if (inst1.synth) {
      inst1.synth.triggerRelease(); // if synth is mono
    }
  });

  function playNote(value) {
    if (value[0] === 144 && value[2] != 0) {
      piano.toggleKey(Tone.Frequency(value[1], "midi").toMidi(), true);
    } else if (value[0] === 144 || value[0] === 128) {
      piano.toggleKey(Tone.Frequency(value[1], "midi").toMidi(), false);
    }
  }

  // got the MIDI code from here:
  // https://github.com/kylestetz/AudioKeys

  let keyboard = new AudioKeys({
    polyphony: 8,
    rows: 1,
    priority: "last"
  });

  keyboard.down(note => {
    if (note.note >= 0 && note.note <= 120) {
      piano.toggleKey(note.note, true);
    }
  });

  keyboard.up(note => {
    if (note.note >= 0 && note.note <= 120) {
      piano.toggleKey(note.note, false);
    }
  });

  // MIDI
  // https://codepen.io/Rumyra/pen/NxdbzL

  let midi, data;
  // start talking to MIDI controller
  if (navigator.requestMIDIAccess) {
    navigator
      .requestMIDIAccess({
        sysex: false
      })
      .then(onMIDISuccess, onMIDIFailure);
  } else {
    console.warn("No MIDI support in your browser");
  }

  // on success
  function onMIDISuccess(midiData) {
    // this is all our MIDI data
    midi = midiData;
    var allInputs = midi.inputs.values();
    // loop over all available inputs and listen for any MIDI input
    for (
      var input = allInputs.next();
      input && !input.done;
      input = allInputs.next()
    ) {
      // when a MIDI value is received call the onMIDIMessage function
      input.value.onmidimessage = gotMIDImessage;
    }
  }
  // var dataList = document.querySelector('#midi-data ul')

  function gotMIDImessage(messageData) {
    playNote(messageData.data);
  }

  // on failure
  function onMIDIFailure() {
    console.warn("Not recognising MIDI controller");
  }
}

class Synth {
  constructor() {
    this.synth = null;
    this.guiSynth = new dat.GUI({
      autoPlace: false
    });
    this.guiSynthFolder = null;
    this.config = null;
    this.configMap = null;
    this.volumeObj = null;
    this.configString = null;
    this.controls = {
      synthType: "__choose a synth__"
    };
    this._initSynthGui();
  }

  disconnect() {
    if (this.synth) this.synth.disconnect();
  }

  _initSynthGui() {
    let _this = this;

    this.guiSynth
      .add(this.controls, "synthType", [
        "__choose a synth__",
        "AMSynth",
        "DuoSynth",
        "FMSynth",
        "MembraneSynth",
        "MetalSynth",
        "MonoSynth",
        "NoiseSynth",
        "PluckSynth",
        "Synth"
      ])
      .onChange(function() {
        if (_this.controls.synthType != "__choose a synth__") {
          _this._initSynth(_this.controls.synthType);
          blurAll();
        }
      });
    this.guiSynth.width = 430;
    let guiContainer = document
      .getElementById("guiContainer")
      .appendChild(this.guiSynth.domElement);
  }
  _initSynth(type) {
    let poly = ["AMSynth", "DuoSynth", "FMSynth", "MonoSynth", "Synth"];
    let _this = this;

    if (this.synth) {
      //if synth exists
      this.synth.disconnect;
      this.synth.dispose();
      if (this.guiSynthFolder) {
        //if there is a folder
        this.guiSynth.removeFolder(this.guiSynthFolder);
      }
    }

    // synth is poly or mono
    if (poly.includes(type)) {
      this.synth = new Tone.PolySynth(8, Tone[type]);
    } else {
      this.synth = new Tone[type]();
    }

    if (fx.fx) {
      //add fx if there's one already created
      this.synth.disconnect();
      fx.updateFxChain();
    } else {
        // this.synth.connect(myAudioAnalyser)
        this.synth.toMaster();
    }
    this._initSynthFolder(type);
  }

  _initSynthFolder(type) {
    let _this = this;

    let _paramObj = {
      harmonicity: {
        min: 0,
        max: 20,
        step: 0.00001
      },
      modulationIndex: {
        min: 0,
        max: 1000,
        step: 0.00001
      },
      vibratoAmount: {
        min: 0,
        max: 100,
        step: 0.001
      },
      vibratoRate: {
        min: 0,
        max: 50,
        step: 0.001
      },
      portamento: {
        min: 0,
        max: 10,
        step: 0.001
      },
      pitchDecay: {
        min: 0,
        max: 2,
        step: 0.0001
      },
      octaves: {
        min: 0,
        max: 10,
        step: 0.0001
      },
      Q: {
        min: 0,
        max: 20,
        step: 0.0001
      },
      frequency: {
        min: 0.0001,
        max: 10000,
        step: 0.0001
      },
      baseFrequency: {
        min: 0,
        max: 10000,
        step: 0.0001
      },
      exponent: {
        min: 0,
        max: 10,
        step: 0.0001
      },
      resonance: {
        min: 0,
        max: 15000,
        step: 0.0001
      },
      volume: {
        min: -99,
        max: 0,
        step: 0.001
      },
      detune: {
        min: -100,
        max: 100,
        step: 0.001
      },
      attack: {
        min: 0.001,
        max: 10,
        step: 0.0001
      },
      decay: {
        min: 0.001,
        max: 1,
        step: 0.0001
      },
      sustain: {
        min: 0.001,
        max: 1,
        step: 0.0001
      },
      release: {
        min: 0.001,
        max: 20,
        step: 0.0001
      },
      partials: {
        min: 0.001,
        max: 20,
        step: 0.0001
      },
      attackNoise: {
        min: 0.1,
        max: 20,
        step: 0.0001
      },
      dampening: {
        min: 0,
        max: 10000,
        step: 0.0001
      }
    };

    // get the default synth config
    this.config = Object.assign(Tone[type].defaults);

    if (typeof this.configMap == "defined") {
      this.configMap.clear();
    }

    //create Map
    this.configMap = new Map(Object.entries(this.config)); // a entry for controlling synth volume

    //add a volume entry that balances some differences between synth types volumes
    if (type == "DuoSynth" || type == "MembraneSynth") {
      this.volumeObj = {
        volume: -6
      };
    } else if (
      type == "MetalSynth" ||
      type == "MonoSynth" ||
      type == "NoiseSynth"
    ) {
      this.volumeObj = {
        volume: -20
      };
    } else {
      this.volumeObj = {
        volume: -3
      };
    }

    this.synth.volume.value = this.volumeObj.volume;
    this.guiSynthFolder = _this.guiSynth.addFolder(type);
    this.guiSynthFolder.open();

    // adding a volume control first on gui
    this.guiSynthFolder
      .add(this.volumeObj, "volume", -50, 0, 0.01)
      .name("synthVolume (db)")
      .onChange(function() {
        _this.synth.volume.value = _this.volumeObj.volume;
      });

    // Iterate over synth default parameters
    for (var [key, value] of this.configMap) {
      if (typeof key == "string" && typeof value == "number") {
        let paramName = key; // e.g. harmonicity, detune
        _this.guiSynthFolder
          .add(
            this.config,
            key,
            _paramObj[key].min,
            _paramObj[key].max,
            _paramObj[key].step
          )
          .onChange(function() {
            _this.synth.set(paramName, _this.config[paramName]);
          });
      }

      if (typeof value == "object") {
        // if there's a nested object
        let _objFolder = this.guiSynthFolder.addFolder(key);
        _objFolder.open();
        let subMap = new Map(Object.entries(value));
        let synthParam = key; //store name of parameter for synth.set
        let subObj = value; //store sub object for gui
        for (var [key, value] of subMap) {
          if (typeof key == "string" && typeof value == "number") {
            let param = key; //store control name for onChange
            let paramValue = value; //stores numerical param
            if (key == "rolloff" || key == "type") {
            } else {
              _objFolder
                .add(
                  subObj,
                  key,
                  _paramObj[key].min,
                  _paramObj[key].max,
                  _paramObj[key].step
                )
                .name(synthParam.concat(".", param))
                .onChange(function() {
                  _this.synth.set(synthParam.concat(".", param), subObj[param]);
                });
            }
          } else if (typeof key == "string") {
            let synthParamType = key; //store name of parameter for synth.set
            let param = value; //store control name for onChange
            if (synthParam == "envelope") {
              _objFolder
                .add(subObj, key, [
                  "exponential",
                  "linear",
                  "sine",
                  "cosine",
                  "bounce",
                  "ripple",
                  "step"
                ])
                .name(synthParam.concat(".", synthParamType))
                .onChange(function() {
                  blurAll();
                });
            } else if (
              synthParam == "oscillator" ||
              synthParam == "modulation"
            ) {
              _objFolder
                .add(subObj, key, [
                  "square",
                  "sine",
                  "triangle",
                  "sawtooth",
                  "pwm",
                  "pulse",
                  "fatsquare",
                  "fatsine",
                  "fattriangle",
                  "fatsawtooth",
                  "fmsquare",
                  "fmsine",
                  "fmtriangle",
                  "fmsawtooth",
                  "amsquare",
                  "amsine",
                  "amtriangle",
                  "amsawtooth"
                ])
                .name(synthParam.concat(".", synthParamType))
                .onChange(function() {
                  _this.synth.set(
                    synthParam.concat(".", synthParamType),
                    subObj[synthParamType]
                  );
                  blurAll();
                });
              // adding partials
              subObj.partials = 0;
              _objFolder
                .add(subObj, "partials", [0, 1, 2, 4, 8, 16, 32, 64, 128])
                .onChange(function() {
                  let osc = subObj[synthParamType].concat(subObj.partials);
                  if (
                    subObj[synthParamType] != "pwm" &&
                    subObj[synthParamType] != "pulse"
                  ) {
                    _this.synth.set(
                      synthParam.concat(".", synthParamType),
                      osc
                    );
                  }
                  blurAll();
                });
            } else if (synthParam == "noise") {
              _objFolder
                .add(subObj, key, ["white", "pink", "brown"])
                .name(synthParam.concat(".", synthParamType))
                .onChange(function() {
                  _this.synth.set(
                    synthParam.concat(".", synthParamType),
                    subObj.type
                  );
                  blurAll();
                  _this.synth.envelope.sustain = 1;
                });
            }
          }

          // This is just for DuoSynth

          if (typeof value == "object") {
            //if there's another nested object
            let subSubMap = new Map(Object.entries(value));
            let synthParamSubType = key; //oscillator or filterEnvelope or Envelope
            let subObj = value;
            let synthParamType = key; //store name of parameter for synth.set

            for (var [key, value] of subSubMap) {
              if (synthParamSubType == "oscillator") {
                _objFolder
                  .add(subObj, key, [
                    "square",
                    "sine",
                    "triangle",
                    "sawtooth",
                    "pwm",
                    "pulse",
                    "fatsquare",
                    "fatsine",
                    "fattriangle",
                    "fatsawtooth",
                    "fmsquare",
                    "fmsine",
                    "fmtriangle",
                    "fmsawtooth",
                    "amsquare",
                    "amsine",
                    "amtriangle",
                    "amsawtooth"
                  ])
                  .name(synthParam.concat(".", key))
                  .onChange(function() {
                    _this.synth.set(
                      synthParam
                        .concat(".", synthParamSubType)
                        .concat(".", Object.entries(subObj)[0][0]),
                      Object.entries(subObj)[0][1]
                    );
                    blurAll();
                  });
              } else {
                _objFolder
                  .add(
                    subObj,
                    key,
                    _paramObj[key].min,
                    _paramObj[key].max,
                    _paramObj[key].step
                  )
                  .name(
                    synthParam.concat(".", synthParamSubType).concat(".", key)
                  )
                  .onChange(function() {
                    _this.synth.set(
                      synthParam
                        .concat(".", synthParamSubType)
                        .concat(".", key),
                      subObj[key]
                    );
                  });
                blurAll();
              }
            }
          }
        }
      }
    }
  }
}

class Fx {
  constructor() {
    this.fx = null;
    this.fxChain = [];
    this.volume = new Tone.Volume(-3);
    this.fxChainEnd = [this.volume, Tone.Master];
    this.configFxMap = null;
    this.initControls = {
      addFx: "___insert an effect___"
    };
    this.guiFx = new dat.GUI({
      autoPlace: false
    });
    this.folder = null;
    this._initGui();
    this.remove = function() {};
  }

  _initGui() {
    let _this = this;

    this.guiContainer = document
      .getElementById("guiFxContainer")
      .appendChild(this.guiFx.domElement);
    this.guiFx.width = 280;

    this.guiFx
      .add(this.initControls, "addFx", [
        "___insert an effect___",
        "AutoFilter",
        "AutoPanner",
        "AutoWah",
        "BitCrusher",
        "Chebyshev",
        "Chorus",
        "Distortion",
        "FeedbackDelay",
        "Freeverb",
        "JCReverb",
        "Phaser",
        "PingPongDelay",
        "PitchShift",
        "Tremolo",
        "Vibrato",
        "Compressor",
        "MultibandCompressor",
        "EQ3",
        "FeedbackCombFilter",
        "Filter",
        "Limiter",
        "LowpassCombFilter"
      ])
      .name("addFx (max: 8)")
      .onChange(function() {
        if (_this.initControls.addFx != "___insert an effect___") {
          _this.folder = _this.guiFx.addFolder(_this.initControls.addFx);
          _this.folder.open();
          _this._initFx(_this.initControls.addFx);
          blurAll();
        }
      });

    var initVol = {
      effectsVolume: -3
    };
    this.guiFx
      .add(initVol, "effectsVolume", -48, 0, 0.001)
      .name("fxVolume (db)")
      .onChange(function() {
        // _this.volume.volume.rampTo(initVol.effectsVolume, 0.2);
        _this.volume.volume.value = initVol.effectsVolume;
        blurAll();
      });
  }

  _initFx(fxType) {
    if (this.fxChain.length < 8) {
      this.fx = new Tone[fxType]();
      //starts fx if is one ot these three below
      if (
        fxType == "AutoFilter" ||
        fxType == "AutoPanner" ||
        fxType == "Tremolo"
      )
        this.fx.start();
      this.fxChain.push(this.fx); //adds to the fx _fxChain
      this._initFxControls(fxType);
      this.updateFxChain();
    } else {
      window.alert("There's a limit of 8 insert effects.");
    }
  }

  updateFxChain() {
    let fxChainComplete = this.fxChain.concat(this.fxChainEnd); //adding fx to volume and Tone.Master

    if (inst1.synth) {
      inst1.synth.disconnect();
      let source = inst1.synth;

      for (var i = 0; i < fxChainComplete.length; i++) {
        //a loop for connecting the fx
        source.connect(fxChainComplete[i]);
        source = fxChainComplete[i];
      }
    }
  }

  _initFxControls(fxType) {
    // get the default synth config
    let _configFxObj = Object.assign(Tone[fxType].defaults);

    let _this = this;
    let _fx = this.fx;
    let _folder = this.folder;
    let _paramFxObj = {
      frequency: {
        min: 0.0001,
        max: 10000,
        step: 0.00001
      },
      baseFrequency: {
        min: 0,
        max: 10000,
        step: 0.00001
      },
      depth: {
        min: 0,
        max: 1,
        step: 0.00001
      },
      octaves: {
        min: 0,
        max: 10,
        step: 0.00001
      },
      Q: {
        min: 0,
        max: 10,
        step: 0.00001
      },
      stages: {
        min: 0,
        max: 10,
        step: 0.00001
      },
      sensitivity: {
        min: -36,
        max: 12,
        step: 0.00001
      },
      gain: {
        min: 0,
        max: 20,
        step: 0.00001
      },
      ratio: {
        min: 1,
        max: 20,
        step: 0.00001
      },
      threshold: {
        min: -99,
        max: 0,
        step: 0.00001
      },
      knee: {
        min: 0,
        max: 40,
        step: 0.00001
      },
      attack: {
        min: 0.001,
        max: 1,
        step: 0.00001
      },
      release: {
        min: 0.001,
        max: 1,
        step: 0.00001
      },
      bits: {
        min: 4,
        max: 8,
        step: 0.0001
      },
      order: {
        min: 1,
        max: 8,
        step: 1
      },
      delayTime: {
        min: 0,
        max: 1,
        step: 0.0001
      },
      maxDelayTime: {
        min: 0,
        max: 1,
        step: 0.0001
      },
      pitch: {
        min: -36,
        max: 36,
        step: 0.0001
      },
      feedback: {
        min: 0,
        max: 1,
        step: 0.0001
      },
      width: {
        min: 0,
        max: 1,
        step: 0.0001
      },
      decay: {
        min: 0,
        max: 5,
        step: 0.0001
      },
      preDelay: {
        min: 0,
        max: 1,
        step: 0.0001
      },
      windowSize: {
        min: 0.03,
        max: 0.1,
        step: 0.0001
      },
      roomSize: {
        min: 0,
        max: 1,
        step: 0.0001
      },
      dampening: {
        min: 0,
        max: 10000,
        step: 0.0001
      },
      spread: {
        min: 0,
        max: 180,
        step: 0.0001
      },
      distortion: {
        min: 0,
        max: 1,
        step: 0.0001
      },
      maxDelay: {
        min: 0,
        max: 10,
        step: 0.0001
      },
      resonance: {
        min: 0,
        max: 1,
        step: 0.0001
      },
      oversample: {
        values: ["none", "2x", "4x"]
      },
      type: {
        values: ["square", "sine", "triangle", "sawtooth"]
      },
      "filter.type": {
        values: [
          "lowpass",
          "highpass",
          "bandpass",
          "lowshelf",
          "highshelf",
          "notch",
          "allpass",
          "peaking"
        ]
      },
      rolloff: {
        values: ["-12", "-12", "-24", "-48", "-96"]
      },
      highFrequency: {
        min: 0,
        max: 10000,
        step: 0.0001
      },
      lowFrequency: {
        min: 0,
        max: 10000,
        step: 0.0001
      },
      low: {
        min: -24,
        max: 0,
        step: 0.0001
      },
      high: {
        min: -24,
        max: 0,
        step: 0.0001
      },
      mid: {
        min: -24,
        max: 0,
        step: 0.0001
      }
    };

    //this prevents a excessive range on frequency parameter for Phaser(danger!), Vibrato and Tremolo effects.
    if (fxType == "Phaser" || fxType == "Tremolo" || fxType == "Vibrato") {
      _paramFxObj.frequency.max = 30;
    }

    // clear Map
    if (this.configFxMap) {
      this.configFxMap.clear();
    }

    //create Map
    this.configFxMap = new Map(Object.entries(_configFxObj)); // a entry for controlling synth volume
    let _configFxMap = this.configFxMap;

    var initialFxControls = {
      removeFx: function() {
        let tempVol = _this.volume.volume.value;
        _this.volume.volume.rampTo(-99, 1); //fadeOut
        _fx.dispose();
        let index = _this.fxChain.indexOf(_fx);
        _this.fxChain.splice(index, 1); // deletes the fx
        _this.updateFxChain(); //update the synth.chain()
        _this.guiFx.removeFolder(_folder);
        _configFxMap.clear();
        _this.volume.volume.rampTo(tempVol, 1); //fadeIn
      },
      wet: 1
    };
    //

    // adding a wet and volume control first on gui
    this.folder.add(initialFxControls, "removeFx");
    this.folder.add(initialFxControls, "wet", 0, 1, 0.001).onChange(function() {
      _this.fx.set("wet", initialFxControls.wet);
      blurAll();
    });

    // Iterate over fx default parameters
    for (var [key, value] of this.configFxMap) {
      let _fx = this.fx;
      let paramName = key; // e.g. harmonicity, detune
      if (typeof key == "string" && typeof value != "object") {
        if (_paramFxObj[key].hasOwnProperty("min")) {
          this.folder
            .add(
              _configFxObj,
              key,
              _paramFxObj[key].min,
              _paramFxObj[key].max,
              _paramFxObj[key].step
            )
            .onChange(function() {
              _fx.set(paramName, _configFxObj[paramName]);
              blurAll();
            });
        } else if (value == "lowpass") {
          this.folder
            .add(_configFxObj, key, [
              "lowpass",
              "highpass",
              "bandpass",
              "lowshelf",
              "highshelf",
              "notch",
              "allpass",
              "peaking"
            ])
            .name(paramName)
            .onChange(function() {
              _fx.set(paramName, _configFxObj[paramName]);
              blurAll();
            });
        } else {
          this.folder
            .add(_configFxObj, key, _paramFxObj[key].values)
            .name(key)
            .onChange(function() {
              _fx.set(paramName, _configFxObj[paramName]);
              blurAll();
            });
        }
      } else {
        if (typeof value == "object") {
          // if there's a nested object
          let subMap = new Map(Object.entries(value));
          let fxParam = key; //store name of parameter for synth.set
          let subObj = value; //store sub object for gui
          for (var [key, value] of subMap) {
            let param = key; //store control name for onChange
            let paramValue = value; //stores numerical param
            if (_paramFxObj[key].hasOwnProperty("min")) {
              this.folder
                .add(
                  subObj,
                  key,
                  _paramFxObj[key].min,
                  _paramFxObj[key].max,
                  _paramFxObj[key].step
                )
                .name(fxParam.concat(".", param))
                .onChange(function() {
                  _fx.set(fxParam.concat(".", param), subObj[param]);
                  blurAll();
                });
            } else {
              if (fxParam == "filter" && param == "type") {
                this.folder
                  .add(subObj, key, [
                    "lowpass",
                    "highpass",
                    "bandpass",
                    "lowshelf",
                    "highshelf",
                    "notch",
                    "allpass",
                    "peaking"
                  ])
                  .name(fxParam.concat(".", param))
                  .onChange(function() {
                    _fx.set(fxParam.concat(".", param), subObj[param]);
                    blurAll();
                  });
              } else {
                this.folder
                  .add(subObj, key, _paramFxObj[key].values)
                  .name(fxParam.concat(".", param))
                  .onChange(function() {
                    _fx.set(fxParam.concat(".", param), subObj[param]);
                  });
              }
            }
          }
        }
      }
    }
  }
}

start()
function start() {
//   console.clear()
  // initial Tone.Js setup
  
  Tone.setContext(context);
  Tone.Transport.start();
  Tone.context.latencyHint = "fastest";
  Tone.context.lookAhead = 0.01;


  initNexus();
  inst1 = new Synth();
  
  fx = new Fx(); //new fx rack with synth as source
}