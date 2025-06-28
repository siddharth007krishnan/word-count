#!/home/siddharth/.nvm/versions/node/v16.13.0/bin/node
import { createReadStream, readFile } from "fs";

/**
 * @TODO Can I read words,chars,lines,bytes from multiple files.
 */


const flags = {
  "w": false, // count words
  "l": false, // count lines
  "m": false, // count characters
  "b": false // count bytes
}

console.log(process.argv)

const [fileName] = process.argv.slice(-1)

const parseArguments = () => {

  const args = process.argv.length >= 2 ? process.argv.slice(2) : []
  args.forEach(arg => {
    if (arg.includes("-")) {
      const flag = arg.slice(1)
      if (flags.hasOwnProperty(flag)) {
        flags[flag] = true
      }
    }
  })
}

/**
 * 
 * @param {string} data - Data to be counted for words, chars and lines which is streamed from stdin or a file (using createReadStream).This is the chunked data which will be returned by the createReadStream 
 */
function countWords(data) {
  for (let i = 0; i < data.length; ++i) {
    currentCharacter = data.at(i)
    console.log(currentCharacter)
    const byteLength = Buffer.from(String.fromCharCode(data.codePointAt(i))).byteLength
    numberOfBytes2 += byteLength
    if (currentCharacter == "\n" || currentCharacter == "\r" || currentCharacter == "\f") {
      ++numberOfLines2
      if (isCharacterAlreadyPresentInLine) {
        ++numberOfWords
      }
      isCharacterAlreadyPresentInLine = false
    }

    if (previousCharacterEncountered === " " && currentCharacter !== " " && currentCharacter !== "\t" && currentCharacter !== "\n" && currentCharacter !== "\r") {
      isCharacterAlreadyPresentInLine = true
      isACharacterAfterSpace = true
      previousWord += currentCharacter
      ++numberOfWords
    }
    previousCharacterEncountered = currentCharacter
    ++numberOfCharacters;
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
const fileReadStream = createReadStream(fileName, { encoding: 'utf-8' })
fileReadStream.on('data', data => {
  // countWords(data)
  for (let i = 0; i < data.length; ++i) {
    currentCharacter = data.at(i)
    const currentCharacterByteLength = Buffer.from(String.fromCharCode(data.codePointAt(i))).byteLength
    numberOfBytes2 += currentCharacterByteLength
    ++numberOfCharacters
    if ([" ", "\t"].includes(currentCharacter)) {
      if (![" ", "\n", "\t", "\f"].includes(previousCharacterEncountered)) {
        ++numberOfWords
      }
    } else
    if (["\n", "\r", "\f"].includes(currentCharacter)) {
      if (![" ", "\n", "\r", "\f", "\t"].includes(previousCharacterEncountered)) {
        ++numberOfWords
      }
      ++numberOfLines
    }
    previousCharacterEncountered = currentCharacter
    // console.log(currentCharacter)
  }
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
  console.log("Number of bytes =", numberOfBytes2);
  console.log("Number of Line =", numberOfLines);
  console.log("Number of characters = ", numberOfCharacters);

  console.log("Number of words =>", numberOfWords);
})
