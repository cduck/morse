# Morse code audio generation tool
This tool can either play morse code directly or save to a WAV file.  It translates plain text from stdin or the command line.  The tone frequency, words per minute, and Farnsworth timing are also configurable through command line arguments.  It should work on Mac, Linux, and Windows but has only been tested to play audio on Mac.

There is also a HTML5 version live [here](https://cduck.github.io/morse/web/play.html).

## Usage
###Playing sound:
```
$ echo "Morse code message." |python3 play.py -f 750 --wpm 10
```

###Create audio file:
```
$ echo "Morse code message." |python3 play.py -f 750 --wpm 10 -o output.wav
```
Output: [output.wav](https://raw.githubusercontent.com/cduck/morse/master/output.wav) ([converted to mp3](https://raw.githubusercontent.com/cduck/morse/master/output.mp3))

###Translate to just `.` and `-` characters:
```
$ echo "Morse code message." |python3 morse.py
-- --- .-. ... .   -.-. --- -.. .   -- . ... ... .- --. . .-.-.-
```

### Learn Morse code using Koch's method
Play a random sequence of 100 A, T, and R letters
```
$ ./koch.py --wpm=30 --fs=10 -l 100 "ATR"
```

## Other audio formats
###Convert to mp3 or other formats with [FFmpeg](http://www.ffmpeg.org/):
```
ffmpeg -i output.wav output.mp3
```
Output: [output.mp3](https://raw.githubusercontent.com/cduck/morse/master/output.mp3)


## Dependencies
- [Python 3](http://www.python.org/)
- [NumPy](http://www.numpy.org/)
- [SciPy](http://www.scipy.org/)
- [sounddevice](http://pypi.python.org/pypi/sounddevice/) which also needs [PortAudio](http://www.portaudio.com/)

