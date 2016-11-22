// Requires morseTable.js

function letterToMorse(letter) {
  if (forwardTable[letter] !== undefined) {
    return forwardTable[letter];
  } else if (letter.trim() === '') {
    return ' ';
  } else {
    return '';
  }
}
function stringToMorse(string) {
  return string.toUpperCase().split('').map(letterToMorse).join(' ');
}

function messageToTimeArr(message, charIndex, wpm, fs) {
  var dps = wpmToDps(wpm);  // dots per second
  var spDot = 1/dps;
  var spDash = spDot * DASH_WIDTH;
  var sbElem = spDot;
  var farnsworthScale = farnsworthScaleFactor(wpm, fs);
  var sbLetter = spDot * CHAR_SPACE * farnsworthScale;
  var sbWord = spDot * WORD_SPACE * farnsworthScale;

  var ch = message[charIndex];
  var code = letterToMorse(ch.toUpperCase());
  var timeArr = [];
  var nextTime = 0;
  if (code == ' ') {
    nextTime += sbWord - sbLetter;
  } else {
    code.split('').forEach(function(c) {  // Loop over characters in code
      if (c === DOT) {
        timeArr.push([nextTime, spDot]);
        nextTime += spDot + sbElem;
      } else if (c === DASH) {
        timeArr.push([nextTime, spDash]);
        nextTime += spDash + sbElem;
      } else if (c === ' ') {
        nextTime += sbLetter - sbElem;
      }
    });
    nextTime += sbLetter - sbElem;
  }

  return {'duration':nextTime, 'timeArr':timeArr, 'ch':ch};
}

function wpmToDps(wpm) {
  // Words per minute = number of times PARIS can be sent per minute.
  // PARIS takes 50 dot lengths to send.  Returns dots per seconds.
  return wpm*50/60.0
}
function farnsworthScaleFactor(wpm, fs) {
  // Returns the multiple that character and word spacing should be multiplied by.
  if (!fs) {
    return 1;  // Standard (not Farnsworth) word spacing
  }
  slowWordInterval = 1/fs;  // Minutes per word
  standardWordInterval = 1/wpm;
  extraSpace = slowWordInterval-standardWordInterval;
  extraSpaceDots = (extraSpace/standardWordInterval) * (9+10+4*DASH_WIDTH+4*CHAR_SPACE+WORD_SPACE);
  standardSpaceDots = 4*CHAR_SPACE + WORD_SPACE;  // For the word PARIS
  totalSpaceDots = standardSpaceDots + extraSpaceDots;
  scaleFactor = totalSpaceDots / standardSpaceDots;
  if (scaleFactor < 1) {
    return 1;
  }
  return scaleFactor;
}

