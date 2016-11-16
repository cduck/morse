#!/usr/bin/env python3

import numpy as np

from morseTable import forwardTable, DOT, DASH, DASH_WIDTH, CHAR_SPACE, WORD_SPACE

def letterToMorse(letter):
  if letter in forwardTable:
    return forwardTable[letter]
  elif letter.isspace():
    return ' '
  else:
    return ''
def stringToMorse(string):
  codeArr = [letterToMorse(l) for l in string.upper()]
  trimmedArr = [code for code in codeArr if code]
  return ' '.join(trimmedArr)

def morseSampleDuration(code, sps, wpm, fs=None):
  dps = wpmToDps(wpm)  # dots per second
  baseSampleCount = sps/dps
  samplesPerDot = int(round(baseSampleCount))
  samplesPerDash = int(round(baseSampleCount * DASH_WIDTH))
  samplesBetweenElements = int(round(baseSampleCount))
  farnsworthScale = farnsworthScaleFactor(wpm, fs)
  samplesBetweenLetters = int(round(baseSampleCount * CHAR_SPACE * farnsworthScale))
  samplesBetweenWords = int(round(baseSampleCount * WORD_SPACE * farnsworthScale))

  dotArr = np.ones(samplesPerDot, dtype=np.bool)
  dashArr = np.ones(samplesPerDash, dtype=np.bool)
  eGapArr = np.zeros(samplesBetweenElements, dtype=np.bool)
  cGapArr = np.zeros(samplesBetweenLetters, dtype=np.bool)
  wGapArr = np.zeros(samplesBetweenWords, dtype=np.bool)

  duration = 0
  prevSpaces = 0
  prevWasElement = False
  for c in code:
    if (c == DOT or c == DASH) and prevWasElement:
      duration += samplesBetweenElements
    if c == DOT:
      duration += samplesPerDot
      prevSpaces, prevWasElement = 0, True
    elif c == DASH:
      duration += samplesPerDash
      prevSpaces, prevWasElement = 0, True
    else:  # Assume the char is a space otherwise
      if prevSpaces == 1:
        duration += samplesBetweenWords-samplesBetweenLetters
      elif prevSpaces == 0:
        duration += samplesBetweenLetters
      prevSpaces += 1
      prevWasElement = False

  return duration

def morseToBoolArr(code, sps, wpm, fs=None):
  dps = wpmToDps(wpm)  # dots per second
  baseSampleCount = sps/dps
  samplesPerDot = int(round(baseSampleCount))
  samplesPerDash = int(round(baseSampleCount * DASH_WIDTH))
  samplesBetweenElements = int(round(baseSampleCount))
  farnsworthScale = farnsworthScaleFactor(wpm, fs)
  samplesBetweenLetters = int(round(baseSampleCount * CHAR_SPACE * farnsworthScale))
  samplesBetweenWords = int(round(baseSampleCount * WORD_SPACE * farnsworthScale))

  dotArr = np.ones(samplesPerDot, dtype=np.bool)
  dashArr = np.ones(samplesPerDash, dtype=np.bool)
  eGapArr = np.zeros(samplesBetweenElements, dtype=np.bool)
  cGapArr = np.zeros(samplesBetweenLetters, dtype=np.bool)
  wGapArr = np.zeros(samplesBetweenWords, dtype=np.bool)

  pieces = []
  prevWasSpace = False
  prevWasElement = False
  for c in code:
    if (c == DOT or c == DASH) and prevWasElement:
      pieces.append(eGapArr)
    if c == DOT:
      pieces.append(dotArr)
      prevWasSpace, prevWasElement = False, True
    elif c == DASH:
      pieces.append(dashArr)
      prevWasSpace, prevWasElement = False, True
    else:  # Assume the char is a space otherwise
      if prevWasSpace:
        pieces[-1] = wGapArr
      else:
        pieces.append(cGapArr)
      prevWasSpace, prevWasElement = True, False

  return np.concatenate(pieces)

def wpmToDps(wpm):
  ''' Words per minute = number of times PARIS can be sent per minute.
      PARIS takes 50 dot lengths to send.  Returns dots per seconds. '''
  return wpm*50/60.0
def farnsworthScaleFactor(wpm, fs=None):
  ''' Returns the multiple that character and word spacing should be multiplied by. '''
  if fs is None:
    return 1  # Standard (not Farnsworth) word spacing
  slowWordInterval = 1.0/fs  # Minutes per word
  standardWordInterval = 1.0/wpm
  extraSpace = slowWordInterval-standardWordInterval
  extraSpaceDots = (extraSpace/standardWordInterval) * (9+10+4*DASH_WIDTH+4*CHAR_SPACE+WORD_SPACE)
  standardSpaceDots = 4*CHAR_SPACE + WORD_SPACE  # For the word PARIS
  totalSpaceDots = standardSpaceDots + extraSpaceDots
  scaleFactor = totalSpaceDots / standardSpaceDots
  if scaleFactor < 1:
    return 1
  return scaleFactor


if __name__ == '__main__':
  import sys

  if len(sys.argv) >= 2:
    message = ' '.join(sys.argv[1:])
    print(stringToMorse(message))
  else:
    try:
      while True:
        message = input()
        print(stringToMorse(message))
    except EOFError:
      pass

