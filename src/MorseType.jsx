import { useState, useRef, useEffect } from "react"

import { getRandomParagraph } from "./sampleText"
import TypingDisplay from "./components/TypingDisplay"
import Stopwatch from "./components/Stopwatch"
import DictKeyboard from "./components/DictKeyboard"

import clsx from "clsx"
import { useStopwatch } from "./hooks/useStopwatch"

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