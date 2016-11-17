#!/usr/bin/env python3

import random
import play

def main(letters, freq, wpm, fs, prompt, outFile, length):
  message = ''.join((random.choice(letters) for i in range(length)))
  play.main(message, freq, wpm, fs, prompt, outFile)

if __name__ == '__main__':
  import sys, argparse

  parser = argparse.ArgumentParser(description='Convert text to morse code audio.')
  parser.add_argument('-l', type=int, default=100, help='Number of letters to play')
  parser.add_argument('-f', type=float, default=play.FREQ, help='Tone frequency')
  parser.add_argument('--wpm', type=float, default=play.WPM, help='Words per minute')
  parser.add_argument('--fs', type=float, default=play.FS, help='Farnsworth speed')
  parser.add_argument('-p', action='store_true', default=False, help='Say letters along with morse code')
  parser.add_argument('-o', type=str, default='', help='Output to given WAV file instead of playing sound')
  parser.add_argument('letters', nargs='*', help='Letters to repeat')
  args = parser.parse_args()

  if len(args.letters) > 0:
    letters = ' '.join(args.letters)
  else:
    letters = sys.stdin.read()

  if not letters:
    print('Specify a message through the command line or stdin.')
    letters = 'AB'
  main(letters, args.f, args.wpm, args.fs, args.p, args.o, args.l)

