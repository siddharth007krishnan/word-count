#!/usr/bin/env node

const { createReadStream } = require("fs")

/**
 * @TODO Can I read words,chars,lines,bytes from multiple files.
 */

let fileName = "";

const flags = {
  w: false, // count words
  l: false, // count lines
  m: false, // count characters
  b: false, // count bytes
  c: false,
};

const formattedOutPutString = () => {
  let outputString = ``;
  if (defaultOutputWithWordsLinesAndBytes) {
    outputString = `  ${numberOfLines}  ${numberOfWords} ${numberOfBytes} `;
  }
  if (flags.l) {
    outputString += `${numberOfLines} `;
  }
  if (flags.w) {
    outputString += `${numberOfWords} `;
  }
  if (flags.b || flags.c) {
    outputString += `${numberOfBytes} `;
  }
  if (flags.m) {
    outputString += `${numberOfCharacters} `;
  }
  if (fileName) {
    outputString += `${fileName}`;
  }

  return outputString;
};

const WHITESPACE_CHARS = [" ", "\t", "\v"];
const LINEBREAK_CHARS = ["\n", "\f"];

let defaultOutputWithWordsLinesAndBytes = true;

/**
 * Parse the command line arguments and set the required filename for the program.
 */
const parseArguments = () => {
  /**
   * @TODO add -L, --max-line-length 
   * @TODO add -files0-from=F read input from files specified by NUL-terminated names in file F;
   * If F is - then read names from standard input.
   */
  const args = process.argv.length > 2 ? process.argv.slice(2) : [];
  args.forEach((arg) => {
    if (arg.includes("--")) {
      defaultOutputWithWordsLinesAndBytes = false;
      switch (arg) {
        case "--bytes":
          flags.b = true;
          break;
        case "--lines":
          flags.l = true;
          break;
        case "--words":
          flags.w = true;
          break;
        case "--characters":
          flags.m = true;
          break;
      }
    } else if (arg.includes("-")) {
      defaultOutputWithWordsLinesAndBytes = false;
      const flag = arg.at(1);
      if (flags.hasOwnProperty(flag)) {
        flags[flag] = true;
      }
    } else {
      fileName = arg;
    }
  });
};

/**
 *
 * @param {string} data - Data to be counted for words, chars and lines which is streamed from stdin or a file (using createReadStream).This is the chunked data which will be returned by the createReadStream
 */
function wordCount(data) {
  for (let i = 0; i < data.length; ++i) {
    currentCharacter = data.at(i);
    if (flags.c || flags.b || defaultOutputWithWordsLinesAndBytes) {
      const currentCharacterByteLength = Buffer.from(
        String.fromCharCode(data.codePointAt(i))
      ).byteLength;
      numberOfBytes += currentCharacterByteLength;
    }

    if (flags.m) {
      ++numberOfCharacters;
    }

    if (flags.l || defaultOutputWithWordsLinesAndBytes) {
      if (LINEBREAK_CHARS.includes(currentCharacter)) {
        ++numberOfLines;
      }
    }

    if (flags.w || defaultOutputWithWordsLinesAndBytes) {
      if (WHITESPACE_CHARS.includes(currentCharacter)) {
        if (![" ", "\n", "\t", "\f"].includes(previousCharacterEncountered)) {
          ++numberOfWords;
        }
      } else if (LINEBREAK_CHARS.includes(currentCharacter)) {
        if (
          ![" ", "\n", "\r", "\f", "\t"].includes(previousCharacterEncountered)
        ) {
          ++numberOfWords;
        }
      }
    }

    previousCharacterEncountered = currentCharacter;
    // console.log(currentCharacter)
  }
}

let numberOfCharacters = 0;
let numberOfLines = 0;
let numberOfWords = 0;
let numberOfBytes = 0;
let previousCharacterEncountered = "";
let currentCharacter = "";

parseArguments();
if (fileName) {
  const fileReadStream = createReadStream(fileName, { encoding: "utf-8" });
  fileReadStream.on("data", (data) => {
    wordCount(data);
  });

  fileReadStream.on("end", () => {
    if (
      !LINEBREAK_CHARS.includes(currentCharacter) &&
      !WHITESPACE_CHARS.includes(currentCharacter)
    ) {
      ++numberOfWords;
    }
    console.log(formattedOutPutString());
  });
} else {
  process.stdin.setEncoding("utf-8");
  process.stdin.on("data", function (data) {
    wordCount(data);
  });
  process.stdin.on("end", function () {
    if (
      !LINEBREAK_CHARS.includes(currentCharacter) &&
      !WHITESPACE_CHARS.includes(currentCharacter)
    ) {
      ++numberOfWords;
    }

    console.log(formattedOutPutString());
  });
}
