import Song from '../chord_sheet/song';

const WHITE_SPACE = /\s/;
const CHORD_LINE_REGEX = /^\s*((([A-G])(#|b)?([^\/\s]*)(\/([A-G])(#|b)?)?)(\s|$)+)+(\s|$)+/;

export default class ChordSheetParser {
  parse(document) {
    this.initialize(document);

    for (let l = 0, lines = this.lines, lineCount = lines.length; l < lineCount; l++) {
      const line = lines[l];
      this.songLine = this.song.addLine();

      if (line.trim().length == 0) {
        this.songItem = null;
      } else {
        this.songItem = this.songLine.addItem();

        if (CHORD_LINE_REGEX.test(line)) {
          let nextLine = this.lines[l + 1];
          this.parseLine(line, nextLine);
          l++;
        } else {
          this.songItem.lyrics = line + '';
        }
      }
    }

    return this.song;
  }

  initialize(document) {
    this.song = new Song();
    this.lines = document.split("\n");
    this.processingText = false;
  }

  parseLine(line, nextLine) {
    this.processCharacters(line, nextLine);

    this.songItem.lyrics += nextLine.substring(line.length);

    this.songItem.chords = this.songItem.chords.trim();
    this.songItem.lyrics = this.songItem.lyrics.trim();

    if (!nextLine.trim().length) {
      this.songLine = this.song.addLine();
    }
  }

  processCharacters(line, nextLine) {
    for (let c = 0, charCount = line.length; c < charCount; c++) {
      const chr = line[c];

      if (WHITE_SPACE.test(chr)) {
        this.processingText = false;
      } else {
        if (!this.processingText) {
          this.songItem = this.songLine.addItem();
          this.processingText = true;
        }

        this.songItem.chords += chr;
      }

      this.songItem.lyrics += nextLine[c] || '';
    }
  }
}