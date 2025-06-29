#!/home/siddharth/.nvm/versions/node/v16.13.0/bin/node
import { createReadStream, readFile } from "fs";

/**
 * @TODO Can I read words,chars,lines,bytes from multiple files.
 */

let fileName = ''

const flags = {
  "w": false, // count words
  "l": false, // count lines
  "m": false, // count characters
  "b": false, // count bytes
  "c": false
}

const WHITESPACE_CHARS = [" ", "\t"]
const LINEBREAK_CHARS = ["\n", "\r", "\f"]

let defaultOutputWithWordsLinesAndBytes = true


/**
 * Parse the command line arguments and set the required filename for the program.
 */
const parseArguments = () => {

  const args = process.argv.length > 2 ? process.argv.slice(2) : []
  console.log("logging args", args)
  args.forEach(arg => {
    if (arg.includes("--") || arg.includes("--")) {
      defaultOutputWithWordsLinesAndBytes = false
      console.log('Logging flag', arg)
      switch (arg) {
        case "--bytes":
          flags.b = true
          break
        case "--lines":
          flags.l = true
          break
        case "--words":
          flags.w = true
          break
        case "--characters":
          flags.m = true
          break
      }
    } else if (arg.includes("-")) {
      defaultOutputWithWordsLinesAndBytes = false
      const flag = arg.at(1)
      if (flags.hasOwnProperty(flag)) {
        flags[flag] = true
      }
    } else {
      fileName = arg
    }
  })
}

/**
 * 
 * @param {string} data - Data to be counted for words, chars and lines which is streamed from stdin or a file (using createReadStream).This is the chunked data which will be returned by the createReadStream 
 */
function wordCount(data) {
  for (let i = 0; i < data.length; ++i) {
    currentCharacter = data.at(i)
    if (flags.c || flags.b || defaultOutputWithWordsLinesAndBytes) {
      const currentCharacterByteLength = Buffer.from(String.fromCharCode(data.codePointAt(i))).byteLength
      numberOfBytes2 += currentCharacterByteLength
    }

    if (flags.m) {
      ++numberOfCharacters
    }

    if (flags.l || defaultOutputWithWordsLinesAndBytes) {
      if (LINEBREAK_CHARS.includes(currentCharacter)) {
        ++numberOfLines
      }
    }

    if (flags.w || defaultOutputWithWordsLinesAndBytes) {
      if (WHITESPACE_CHARS.includes(currentCharacter)) {
        if (![" ", "\n", "\t", "\f"].includes(previousCharacterEncountered)) {
          ++numberOfWords
        }
      } else
        if (LINEBREAK_CHARS.includes(currentCharacter)) {
          if (![" ", "\n", "\r", "\f", "\t"].includes(previousCharacterEncountered)) {
            ++numberOfWords
          }
        }
    }

    previousCharacterEncountered = currentCharacter
    // console.log(currentCharacter)
  }
}

let numberOfCharacters = 0;
let numberOfLines = 0;
let numberOfWords = 0;
let numberOfLines2 = 0;
let numberOfSpaces = 0;
let numberOfBytes2 = 0;
let isCharacterAlreadyPresentInLine = false
let isACharacterAfterSpace = false
let previousCharacterEncountered = ''
let currentCharacter = '';
let previousWord = ''

// const file = createReadStream('./text.txt', { encoding: 'utf-8'})

parseArguments()
console.log(fileName)
if (fileName) {
  const fileReadStream = createReadStream(fileName, { encoding: 'utf-8' })
  fileReadStream.on('data', data => {
    // countWords(data)
    // for (let i = 0; i < data.length; ++i) {
    //   currentCharacter = data.at(i)
    //   const currentCharacterByteLength = Buffer.from(String.fromCharCode(data.codePointAt(i))).byteLength
    //   numberOfBytes2 += currentCharacterByteLength
    //   ++numberOfCharacters
    //   if (WHITESPACE_CHARS.includes(currentCharacter)) {
    //     if (![" ", "\n", "\t", "\f"].includes(previousCharacterEncountered)) {
    //       ++numberOfWords
    //     }
    //   } else
    //     if (LINEBREAK_CHARS.includes(currentCharacter)) {
    //       if (![" ", "\n", "\r", "\f", "\t"].includes(previousCharacterEncountered)) {
    //         ++numberOfWords
    //       }
    //       ++numberOfLines
    //     }
    //   previousCharacterEncountered = currentCharacter
    // }
    wordCount(data)
  })
  // readFile(fileName, { encoding: 'utf8' }, (err, data) => {
  // console.log(data);
  // const numberOfLines = data.split("\n").length - 1;
  // console.log(numberOfLines);

  // console.log(data.split(" ").length);

  // const bufferData = Buffer.from(data, 'utf-8')

  // for (let i = 0; i < bufferData.length; ++i) {
  //   const asciiValue = bufferData.at(i);
  //   // console.log(asciiValue)
  //   console.log('A'.charCodeAt(0))
  //   if (('a'.charCodeAt(0) >= asciiValue && 'z'.charCodeAt(0) <= asciiValue) || ('A'.charCodeAt(0) >= asciiValue && 'Z'.charCodeAt(0) <= asciiValue )) {
  //     ++numberOfCharacters;
  //   } 
  // }
  // let numberOfLines2 = 0;
  // let numberOfSpaces = 0;
  // let numberOfBytes2 = 0;
  // let isCharacterAlreadyPresentInLine = false
  // let isACharacterAfterSpace = false
  // let previousCharacterEncountered = ''
  // let currentCharacter = '';
  // let previousWord = ''
  // for (let i  = 0; i < data.length; ++i) {
  //   currentCharacter = data.at(i)  
  //   const byteLength = Buffer.from(String.fromCharCode(data.codePointAt(i))).byteLength
  //   numberOfBytes2 += byteLength
  //   if (currentCharacter == "\n" || currentCharacter == "\r" || currentCharacter == "\f") {
  //     ++numberOfLines2
  //     if (isCharacterAlreadyPresentInLine) {
  //       ++numberOfWords
  //     }
  //     isCharacterAlreadyPresentInLine = false
  //   } else
  //   if (previousCharacterEncountered === " " && currentCharacter !== " " && currentCharacter !== "\t" && currentCharacter !== "\n" && currentCharacter !== "\r") {
  //     isCharacterAlreadyPresentInLine = true
  //     isACharacterAfterSpace = true
  //     previousWord += currentCharacter
  //     ++numberOfWords
  //   }
  //   previousCharacterEncountered = currentCharacter
  //   ++numberOfCharacters;
  // } 
  // console.log(data.length)
  // console.log("Number of bytes =", numberOfBytes2);
  // console.log("Number of Line =", numberOfLines2);
  // console.log("Number of characters = ", numberOfCharacters);

  // console.log("Number of words =>", numberOfWords);
  // })
  fileReadStream.on('end', () => {
    if (!LINEBREAK_CHARS.includes(currentCharacter) && !WHITESPACE_CHARS.includes(currentCharacter)) {
      ++numberOfWords
    }
    console.log("Number of bytes =", numberOfBytes2);
    console.log("Number of Line =", numberOfLines);
    if (flags.m) {
      console.log("Number of characters = ", numberOfCharacters);
    }
    console.log("Number of Words = ", numberOfWords);
  })
} else {
  process.stdin.setEncoding('utf-8')
  process.stdin.on('data', function (data) {
    wordCount(data)
  })
  process.stdin.on('end', function () {
    if (!LINEBREAK_CHARS.includes(currentCharacter) && !WHITESPACE_CHARS.includes(currentCharacter)) {
      ++numberOfWords
    }
    console.log("Number of bytes =", numberOfBytes2);
    console.log("Number of Line =", numberOfLines);
    if (flags.m) {
      console.log("Number of characters = ", numberOfCharacters);
    }
    console.log("Number of Words = ", numberOfWords);

  })
}

