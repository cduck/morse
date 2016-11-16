# Morse code audio generation tool
This tool can either play morse code directly or save to a WAV file.  It translates plain text from stdin or the command line.  The tone frequency, words per minute, and Farnsworth timing are also configurable through command line arguments.  It should work on Mac, Linux, and Windows but has only been tested to play audio on Mac.

## Usage
###Playing sound:
```
$ echo "Morse code message." |python3 play.py -f 750 --wpm 10
```

###Create audio file:
```
$ echo "Morse code message." |python3 play.py -f 750 --wpm 10 -o output.wav
```
Output: [output.wav](output.wav)

###Translate to just `.` and `-` characters:
```
$ echo "Morse code message." |python3 morse.py
-- --- .-. ... .   -.-. --- -.. .   -- . ... ... .- --. . .-.-.-
```

## Dependencies
- [Python 3](http://www.python.org/)
- [NumPy](http://www.numpy.org/)
- [SciPy](http://www.scipy.org/)
- [sounddevice](http://pypi.python.org/pypi/sounddevice/) which also needs [PortAudio](http://www.portaudio.com/)

