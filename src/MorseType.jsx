import { useState, useRef, useEffect } from "react"

import { getRandomParagraph } from "./sampleText"

import clsx from "clsx"
import { useStopwatch } from "./hooks/useStopwatch"

const MORSE_DICT = {
  "A": ".-",     "B": "-...",   "C": "-.-.",   "D": "-..",
  "E": ".",      "F": "..-.",   "G": "--.",    "H": "....",
  "I": "..",     "J": ".---",   "K": "-.-",    "L": ".-..",
  "M": "--",     "N": "-.",     "O": "---",    "P": ".--.",
  "Q": "--.-",   "R": ".-.",    "S": "...",    "T": "-",
  "U": "..-",    "V": "...-",   "W": ".--",    "X": "-..-",
  "Y": "-.--",   "Z": "--..",

  "0": "-----",  "1": ".----",  "2": "..---",  "3": "...--",
  "4": "....-",  "5": ".....",  "6": "-....",  "7": "--...",
  "8": "---..",  "9": "----.",

  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.",
  "!": "-.-.--", "/": "-..-.",  "(": "-.--.",  ")": "-.--.-",
  "&": ".-...",  ":": "---...", ";": "-.-.-.", "=": "-...-",
  "+": ".-.-.",  "-": "-....-", "_": "..--.-", '"': ".-..-.",
  "$": "...-..-", "@": ".--.-.",

  " ": "/"
}

const KEYBOARD = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', "-"],
     ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", '"'],
           ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "?"]
]

function DictKeyCap({ symbol, morse }) {
  return (
    <div className="h-16 w-16 flex flex-col justify-center items-center border rounded-lg">
      <p className="font-mono text-lg/tight font-bold m-0">{symbol}</p>
      <p className={clsx("font-mono leading-tight", morse.length > 4 ? "text-sm tracking-wider" : "text-md tracking-wide")}>{morse}</p>
    </div>
  )
}

function DictKeyboard() {
  const rows = KEYBOARD.map(row => row.map(ch => (
    <DictKeyCap key={ch} symbol={ch} morse={toDisplay(toMorse(ch))} />
  )))

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-1 pr-12">{rows[0]}</div>
      <div className="flex gap-1 pl-8 pr-20">{rows[1]}</div>
      <div className="flex gap-1 pl-12">{rows[2]}</div>
      <div className="flex gap-1 pl-20 pr-4">{rows[3]}</div>
      <div className="flex gap-1">{rows[4]}</div>
      <div className="flex gap-1">{rows[5]}</div>
    </div>
  )
}


function toMorse(word) {
  let morse = ""
  for (const ch of word) {
    morse += MORSE_DICT[ch.toUpperCase()] + " "
  }
  return morse.slice(0, -1)
}

function toDisplay(morse) {
  return morse.replaceAll(".", "•")
}

function MorseChar({ char, isCorrect }) {
  return <span className={clsx("whitespace-pre", isCorrect === undefined ? "text-gray-400" : (isCorrect ? "text-black" : "text-red-500"))}>{char}</span>
}

function TargetChar({ char, isCorrect }) {
  return <span className={clsx("whitespace-pre", isCorrect === undefined ? "text-gray-400" : (isCorrect ? "text-black" : "text-red-500"))}>{char}</span>
}


function Stopwatch({ msElapsed }) {
  const sec = Math.floor((msElapsed / 1000) % 60).toString().padStart(2, "0")
  const min = Math.floor((msElapsed / (1000 * 60))).toString().padStart(2, "0")
  const ms = Math.floor((msElapsed / 10) % 100).toString().padStart(2, "0")

  return (
    <div className="text-6xl">
      {min}:{sec}<span className="text-4xl">.{ms}</span>
    </div>
  )
}

function TypingDisplay({ targetWords, pastWords, currWord, currLetter }) {
  const morseLine = [];
  const targetLine = [];

  // pastWords
  for (let i = 0; i < Math.min(pastWords.length, targetWords.length); i++) {
    for (const [j, letter] of pastWords[i].split(" ").entries()) {
      if (j >= targetWords[i].length) {
        morseLine.push(<MorseChar char={letter} isCorrect={false} />)
      }
      else if (toMorse(targetWords[i][j]) === letter) {
        morseLine.push(<MorseChar char={toDisplay(letter)} isCorrect={true} />)
        targetLine.push(<TargetChar char={targetWords[i][j]} isCorrect={true} />)
      }
      else {
        morseLine.push(<MorseChar char={toDisplay(letter)} isCorrect={false} />)
        targetLine.push(<TargetChar char={targetWords[i][j]} isCorrect={false} />)
      }
      morseLine.push(<MorseChar char={" "} isCorrect={true} />)
    }
    morseLine.pop() // Remove last space of every word
    morseLine.push(<MorseChar char="/" isCorrect={true} />)

    if (pastWords[i].split(" ").length < targetWords[i].length) {
      targetLine.push(<TargetChar char={targetWords[i].slice(pastWords[i].split(" ").length)} isCorrect={false} />)
    }
    targetLine.push(<TargetChar char=" " isCorrect={true} />)
  }

  // currWord
  if (currWord != "") {
    for (const [i, letter] of currWord.split(" ").entries()) {
      if (i >= targetWords[pastWords.length].length) {
        morseLine.push(<MorseChar char={toDisplay(letter)} isCorrect={false} />)
      }
      else if (toMorse(targetWords[pastWords.length][i]) === letter) {
        morseLine.push(<MorseChar char={toDisplay(letter)} isCorrect={true} />)
        targetLine.push(<TargetChar char={targetWords[pastWords.length][i]} isCorrect={true} />)
      }
      else {
        morseLine.push(<MorseChar char={toDisplay(letter)} isCorrect={false} />)
        targetLine.push(<TargetChar char={targetWords[pastWords.length][i]} isCorrect={false} />)
      }
      morseLine.push(<MorseChar char=" " />)
    }
    targetLine.push(<TargetChar char={targetWords[pastWords.length].slice(currWord.split(" ").length)}/>)
  }
  else {
    targetLine.push(<TargetChar char={targetWords[pastWords.length]}/>)
  }

  // currLetter
  morseLine.push(<MorseChar char={toDisplay(currLetter)} />)

  targetLine.push(<TargetChar char={" " + targetWords.slice(pastWords.length+1).join(" ")} />)

  const completedCharNum = targetWords.slice(0, pastWords.length).reduce((total, word) => total += word.length + 1, 0) + (currWord === "" ? 0 : targetWords[pastWords.length].slice(0, currWord.split(" ").length).length)
  
  return (
    <div className="w-full flex flex-col justify-center items-center relative overflow-hidden">
      <div className="w-px h-40 py-5 flex flex-col justify-between bg-gray-400">
        <div className="w-fit self-start text-nowrap text-4xl" style={{ transform: `translateX(-${completedCharNum}ch)` }}>
          {targetLine}
        </div>
        <div className="w-fit self-end text-nowrap text-4xl">
          {morseLine}
        </div>
      </div>
    </div>
  )
}

export default function MorseType() {
  // Tracks whether the game is focused, must be focused to handle input
  const [focused, setFocused] = useState(false)
  // Ref to the main game div, use to track focus
  const gameRef = useRef(null)

  // Game data
  const [finished, setFinished] = useState(false)
  const { elapsed, running, start, stop, reset } = useStopwatch();

  const [targetWords, setTargetWords] = useState(getRandomParagraph().split(" "))
  const [pastWords, setPastWords] = useState([])
  const [currWord, setCurrWord] = useState("")
  const [currLetter, setCurrLetter] = useState("")


  // Auto-focus on mount
  useEffect(() => {
    gameRef.current?.focus({ preventScroll: true })
  }, [])

  function handleNewLetter() {
    if (currLetter === "") return

    if (currWord === "") {
      setCurrWord(prev => prev + currLetter)
    }
    else {
      setCurrWord(prev => prev + " " + currLetter)
    }
    setCurrLetter("")
  }

  function handleNewWord() {
    if (currWord === "" && currLetter === "") return

    // finished all targetWords (ignores correctness)
    if (pastWords.length + 1 >= targetWords.length) {
      handleFinish()
    }

    let newWord = currWord
    // Include current letter in new word
    if (currLetter !== "") {
      if (newWord !== "") {
        newWord += " "
      }
      newWord += currLetter
      setCurrLetter("")
    }

    setPastWords(prev => [...prev, newWord])
    setCurrWord("")
  }

  function handleDelete() {
    if (currLetter !== "") {
      setCurrLetter(prev => prev.slice(0, -1))
      return
    }
    
    else if (currWord !== "") {
      if (currWord.includes(" ")) {
        const lastSpaceIndex = currWord.lastIndexOf(" ")
        setCurrLetter(currWord.slice(lastSpaceIndex+1))
        setCurrWord(prev => prev.slice(0, lastSpaceIndex))
      }
      else {
        setCurrLetter(currWord)
        setCurrWord("")
      }
    }

    else if (pastWords.length !== 0) {
      const lastWord = pastWords.at(-1)
      setPastWords(prev => prev.slice(0, -1))

      if (lastWord.includes(" ")) {
        const lastSpaceIndex = lastWord.lastIndexOf(" ")
        setCurrLetter(lastWord.slice(lastSpaceIndex+1))
        setCurrWord(lastWord.slice(0, lastSpaceIndex))
      }
      else {
        setCurrLetter(lastWord)
      }
    }
  }

  function handleFinish() {
    stop()
    setFinished(true)
  }

  function handleKeyDown(e) {
    // Prevent default behavior
    if ([".", "-", "/", " ", "Backspace"].includes(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault()
    }
    else return

    if (finished) return

    // Start timer
    if (pastWords.length === 0 && currWord.length === 0 && currLetter.length === 0 && !running) {
      start()
    }
    
    // Continue curr letter
    if (e.key === "." || e.key === "-") {
      setCurrLetter(prev => prev + e.key)
    }
    else if (e.key === " ") handleNewLetter()
    else if (e.key === "/") handleNewWord()
    else if (e.key === "Backspace") handleDelete()
    
  }

  return (
    <div
      tabIndex={0}
      ref={gameRef}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={handleKeyDown}
      className="w-full h-full flex flex-col gap-20 justify-center items-center overflow-hidden font-mono"
    >
      <Stopwatch msElapsed={elapsed} />
      <TypingDisplay
        targetWords={targetWords}
        pastWords={pastWords}
        currWord={currWord}
        currLetter={currLetter}
      />
      <DictKeyboard />
    </div>
  )
}