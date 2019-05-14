    https://melbark.com
    
    Melbark provides a set of midi, synth, spectrogram and music generation
    tools using the web audio api, h2o and tensorflow.

    Follow these steps to generate midi tracks in the style of the artist of your choosing:

    step 1:
    Download midi tracks in the style you want. Import to midiviz2csv and export csv.

    An impressive collection of midis can be found @
    https://www.reddit.com/r/WeAreTheMusicMakers/comments/3ajwe4/the_largest_midi_collection_on_the_internet/


    step 2
    Choose a machine learning pattern from the links provided. Save a copy and run all cells.

    Upload the csv from step 1 to use as training data.
    Once the notebook has completed, csv and json files of the new track will be generated
    
    step 3.
    Import the json file from step 2 to json2midi to create your new midi track.
    From here you can import to midivizcsv or spectralpool>purple to play the midi.
    
    If you want a more organic sound try:
    ableton live > native instruments native access > kontact and a piano library from
    http://bigcatinstruments.blogspot.com/2014/08/gm-midi-instruments-for-kontakt.html
         

   SPECTRALPOOLS:
   Allow you to create a pixel perfect soundscape layer by layer. Similar as to how you would create an image 
   in photoshop. The synth is your brush and the spectrogram is your canvas. Where you 
   paint is what you hear.  Tilt pens allow you to control velocity via pressure and synth 
   effects by tilt. The spectrogram scale is inspired by the mel and bark pyschoacoustic scales.
   A balance of control without distorting perception of distance on screen and note interval.

    spectralpool - black  (red and pink variations): 
      polyphonic ,
      additive synth,
      tonejs and tunajs effects,
      recording,
      arpeggiator ,
      microphone and midi inputs.
    *Requires chrome < 65

    spectralpool - purple: 
      monophonic ,
      tonejs and tunajs effects,
      recording,
      arpeggiator ,
      microphone and midi inputs,
      sample pads.
  
    There is an ableton option which changes the node chain 
    to prevent output of microphone input while still displaying
    on the spectrogram - see tutorial.


    ML DATA FORMAT
    Data is transformed to a format of midi*duration*timedelta and each note is separated by tab
    Example: 68*33*0 72*33*33 65*33*0 72*33*34 60*33*0

    Timedelta is the duration between current and last note. Having the delta avoids the need to include breaks.
    Chords are created when timedelta equals zero.

    Duration and timedelta are represented as fraction of beat and then multiplied by a factor to bin.

    Velocity and instruments can also be included.

    Track index is removed. Dataframe is sorted by time and timedelta is calculated by a row offset. Track index can be reconstructed on output.

    Dataset is standardised by: 
    -time/bpm
    -shifting all data around a standard midi mode 
    -offsetting each midi note by [0,-3,4,5,-5,9,-9]

    Midi range is filtered between 30 and 90. Duration and timedelta are filtered to two full bars.

    For instructions and demos please visit  https://soundcloud.com/melbark, https://github.com/melbark, https://youtube.com/melbark or live at https://twitch.com/spectralpool
    

