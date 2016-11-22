// Requires morse.js and morseTable.js

// Global variables
var fakePlayer;
var messageArea;
var extraStyle;
var context;
var panNode;
var volGain;
var pauseGain;
var oscillator;

var audioBufferDuration = 0.2;
var audioBufferUpdate = 0.05;
var toneSmoothTime = 0.04;
var pauseSmoothTime = 0.5;
var frequency = 750;  // Default frequency
var pan = 0;
var volume = 1;
var wpm = 35;  // Words per minute
var fs = 6;  // Farnsworth speed
var playingMessage = null;
var currentIndex = 0;

var nextStartTime = 0;
var playing = false;


window.addEventListener('load', initPlay, false);


function initPlay() {
  initAudioContext();
  initExtraStyle();

  messageArea = document.getElementById("messageArea");

  loadSavedFrequency();
  loadSavedPan();
  loadSavedVolume();
  loadSavedWpm();
  loadSavedFs();
  loadCurrentIndex();
  loadSavedMessage();
  indexMessageForHighlight();
  highlightLetterIndex(currentIndex);
  updateNavControls();
}
function initExtraStyle() {
  var style = document.createElement("style");
  document.head.appendChild(style);
  extraStyle = style.sheet;
  extraStyle.insertRule("#dummy {}", 0);
}
function initAudioContext() {
  window.AudioContext = window.AudioContext||window.webkitAudioContext||null;
  if (window.AudioContext !== null) {
    context = new AudioContext();
  } else {
    // Audio not supported
    context = null;
    showSupportError();
  }
  if (context) {
    volGain = context.createGain();
    if (context.createStereoPanner) {
      panNode = context.createStereoPanner();
    } else {
      panNode = context.createGain();
    }
    panNode.connect(context.destination);
    volGain.connect(panNode);
  }
}
function showSupportError() {
  document.getElementById("supportError").style.display = "";
}
function enableMobileBackgroundAudio() {
  document.getElementById("enableBackground").style.display = "none";
  document.getElementById("disableBackground").style.display = "";
  if (!fakePlayer) {
    fakePlayer = new Audio();
    fakePlayer.loop = true;
    fakePlayer.muted = true;
    fakePlayer.onplay = playMorse();
    fakePlayer.onpause = pauseMorse();
    document.body.appendChild(fakePlayer);
  }
}
function disableMobileBackgroundAudio() {
  document.getElementById("enableBackground").style.display = "";
  document.getElementById("disableBackground").style.display = "none";
  if (fakePlayer) {
    fakePlayer.parentNode.removeChild(fakePlayer);
    fakePlayer = null;
  }
}


// Frequency setting
function frequencyButtonPress(f) {
  document.getElementById("freqText").value = f;
  setFrequencySlider(f);
  setFrequency(f);
}
function frequencyTextChange() {
  var f = parseFloat(document.getElementById("freqText").value);
  setFrequencySlider(f);
  setFrequency(f);
}
function frequencySliderChange() {
  var fExp = parseFloat(document.getElementById("freqSlider").value);
  var f = Math.round(Math.pow(10, fExp));
  document.getElementById("freqText").value = f;
  setFrequency(f);
}
function setFrequencySlider(f) {
  var fExp = Math.log10(f);
  document.getElementById("freqSlider").value = fExp;
}
function setFrequency(f) {
  frequency = f;
  localStorage.frequency = f+"";
  setOscillatorFrequency(f);
}
function loadSavedFrequency() {
  if (typeof localStorage.frequency == "string") {
    frequency = parseFloat(localStorage.frequency);
  } // Else don't change the frequency
  setFrequencySlider(frequency);
  document.getElementById("freqText").value = frequency;
  setOscillatorFrequency(frequency);
}

// Left-right pan setting
function panTextChange() {
  var f = parseFloat(document.getElementById("panText").value);
  document.getElementById("panSlider").value = f;
  setPan(f);
}
function panSliderChange() {
  var f = parseFloat(document.getElementById("panSlider").value);
  document.getElementById("panText").value = f;
  setPan(f);
}
function setPan(f) {
  pan = f;
  localStorage.pan = f+"";
  setOscillatorPan(f);
}
function loadSavedPan() {
  if (typeof localStorage.pan == "string") {
    pan = parseFloat(localStorage.pan);
  }
  document.getElementById("panSlider").value = pan;
  document.getElementById("panText").value = pan;
  setOscillatorPan(pan);
}

// Volume setting
function volumeTextChange() {
  var f = parseFloat(document.getElementById("volText").value);
  document.getElementById("volSlider").value = f;
  setVolume(f);
}
function volumeSliderChange() {
  var f = parseFloat(document.getElementById("volSlider").value);
  document.getElementById("volText").value = f;
  setVolume(f);
}
function setVolume(f) {
  volume = f;
  localStorage.volume = f+"";
  setOscillatorVolume(f);
}
function loadSavedVolume() {
  if (typeof localStorage.volume == "string") {
    volume = parseFloat(localStorage.volume);
  }
  document.getElementById("volSlider").value = volume;
  document.getElementById("volText").value = volume;
  setOscillatorVolume(volume);
}

// Words per minute setting
function wpmTextChange() {
  var f = parseFloat(document.getElementById("wpmText").value);
  document.getElementById("wpmSlider").value = f;
  setWpm(f);
}
function wpmSliderChange() {
  var f = parseFloat(document.getElementById("wpmSlider").value);
  document.getElementById("wpmText").value = f;
  setWpm(f);
}
function setWpm(f) {
  wpm = f;
  localStorage.wpm = f+"";
}
function loadSavedWpm() {
  if (typeof localStorage.wpm == "string") {
    wpm = parseFloat(localStorage.wpm);
  }
  document.getElementById("wpmSlider").value = wpm;
  document.getElementById("wpmText").value = wpm;
}

// Farnsworth speed setting
function fsTextChange() {
  var f = parseFloat(document.getElementById("fsText").value);
  document.getElementById("fsSlider").value = f;
  setFs(f);
}
function fsSliderChange() {
  var f = parseFloat(document.getElementById("fsSlider").value);
  document.getElementById("fsText").value = f;
  setFs(f);
}
function setFs(f) {
  fs = f;
  localStorage.fs = f+"";
}
function loadSavedFs() {
  if (typeof localStorage.fs == "string") {
    fs = parseFloat(localStorage.fs);
  }
  document.getElementById("fsSlider").value = fs;
  document.getElementById("fsText").value = fs;
}

// Navigation controls
function navTextChange() {
  var f = parseFloat(document.getElementById("navText").value);
  document.getElementById("navSlider").value = f;
  setNav(f);
}
function navSliderChange() {
  var f = parseFloat(document.getElementById("navSlider").value);
  document.getElementById("navText").value = f;
  setNav(f);
}
function setNav(f) {
  currentIndex = f;
  saveCurrentIndex();
  highlightLetterIndex(currentIndex);
}
function updateNavControls() {
  if (!playingMessage) {
    var slider = document.getElementById("navSlider");
    slider.max = 0;
    slider.value = 0;
    document.getElementById("navText").value = "";
    document.getElementById("navMax").innerText = "--";
  } else {
    var maxVal = playingMessage.length-1;
    var slider = document.getElementById("navSlider");
    slider.max = maxVal;
    slider.value = currentIndex;
    document.getElementById("navText").value = currentIndex;
    document.getElementById("navMax").innerText = maxVal+"";
  }
}

// Saved message index
function loadCurrentIndex() {
  if (typeof localStorage.currentIndex == "string") {
    currentIndex = parseInt(localStorage.currentIndex);
  }
}
function saveCurrentIndex() {
  localStorage.currentIndex = currentIndex+"";
}


// Load message file
function loadMessageFile() {
  var input = document.getElementById("file");
  if (input.files.length >= 1) {
    var file = input.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      messageArea.innerText = e.target.result;
    };
    reader.readAsText(file);
  }
}
function loadSavedMessage() {
  if (typeof localStorage.message == "string") {
    messageArea.innerText = localStorage.message;
  }
}
function saveMessageText() {
  localStorage.message = messageArea.innerText;
}


// Log
function appendLog(message) {
  console.log(message);
  var log = document.getElementById("log");
  log.innerText += "\n" + message;
}


// Letter highlighting
function highlightLetterIndex(i) {
  extraStyle.deleteRule(0);
  extraStyle.insertRule("#messageArea span:nth-of-type("+(i+1)+") {color: red}", 0);
}
function indexMessageForHighlight() {
  var m = messageArea.innerText;
  m2 = "<span>" + (m.split("").join("</span><span>")) + "</span>";
  m3 = m2.split(/\r\n|\r|\n/g).join("<br>");
  messageArea.innerHTML = m3;
}


// Sound generation
function scheduleBeep(t, dur) {
  if (!pauseGain) {
    pauseGain = context.createGain();
    pauseGain.connect(volGain);
  }
  var o = context.createOscillator();
  var g = context.createGain();
  o.type = "sine";
  o.frequency.value = frequency;
  o.connect(g);
  g.connect(pauseGain);
  o.start(t);
  g.gain.setValueAtTime(1, t);
  g.gain.setValueAtTime(1, t+dur);
  g.gain.exponentialRampToValueAtTime(0.00001, t+dur+toneSmoothTime);
  o.stop(t+dur+toneSmoothTime);
}
function scheduleTimeArr(t, timeArr) {
  timeArr.forEach(function(timing) {
    scheduleBeep(t+timing[0], timing[1]);
  });
}
function scheduleMorseChar(t, i) {
  info = messageToTimeArr(playingMessage, i, wpm, fs);
  scheduleTimeArr(t, info.timeArr);
  return t + info.duration;
}
function bufferAudio() {
  if (!playing) return;

  var t = context.currentTime;
  var dur;
  while (nextStartTime <= t + audioBufferDuration) {
    if (currentIndex >= playingMessage.length) {
      playing = false;
      currentIndex = 0;
      highlightLetterIndex(currentIndex);
      updateNavControls();
      return;  // Done playing
    }
    nextStartTime = scheduleMorseChar(nextStartTime, currentIndex);
    highlightLetterIndex(currentIndex);
    updateNavControls();
    saveCurrentIndex();
    currentIndex++;
  }
  setTimeout(bufferAudio, audioBufferUpdate);
}


function playMorse() {
  indexMessageForHighlight();
  saveMessageText();
  playingMessage = messageArea.innerText;

  if (currentIndex > 0) {
    currentIndex--;
  }
  nextStartTime = context.currentTime + 0.1;

  updateNavControls();

  playing = true;
  bufferAudio();

  if (fakePlayer) {
  //  fakePlayer.play();
  }
  appendLog("Play");
}
function pauseMorse() {
  var t = context.currentTime;
  if (pauseGain) {
    pauseGain.gain.setValueAtTime(1, t);
    pauseGain.gain.exponentialRampToValueAtTime(0.00001, t+pauseSmoothTime);
    pauseGain = null;
  }
  playing = false;
  if (fakePlayer) {
  //  fakePlayer.pause();
  }
  appendLog("Pause");
}
function restartMorse() {
  currentIndex = 0;
  appendLog("Restart");
  playMorse();
}


// Update audio manipulation settings
function setOscillatorFrequency(f) {
  if (oscillator) {
    oscillator.frequency.value = f;
  }
}
function setOscillatorPan(p) {
  if (context.createStereoPanner) {
    panNode.pan.value = p;
  }
}
function setOscillatorVolume(v) {
  if (v <= 0) v = 0.00001;
  volGain.gain.exponentialRampToValueAtTime(
    v, context.currentTime + 0.04
  );
}


