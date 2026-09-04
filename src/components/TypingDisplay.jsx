import { toDisplay, toMorse } from "../utils";

import clsx from "clsx";

function MorseChar({ char, isCorrect }) {
  return <span className={clsx("whitespace-pre", isCorrect === undefined ? "text-gray-400" : (isCorrect ? "text-black" : "text-red-500"))}>{char}</span>
}

function TargetChar({ char, isCorrect }) {
  return <span className={clsx("whitespace-pre", isCorrect === undefined ? "text-gray-400" : (isCorrect ? "text-black" : "text-red-500"))}>{char}</span>
}

export default function TypingDisplay({ targetWords, pastWords, currWord, currLetter }) {
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
