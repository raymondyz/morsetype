import { formatTime, toMorse } from "../utils"

function countCorrectChars(targetWords, submittedWords) {
  let count = 0

  for (let i = 0; i < targetWords.length; i++) {
    const targetWord = targetWords[i]
    const submittedWord = submittedWords[i].split(" ")

    for (let j = 0; j < submittedWord.length; j++) {
      if (j >= targetWord.length) continue
      if (toMorse(targetWord[j]) === submittedWord[j]) count ++
    }
  }

  return count
}

export default function ResultScreen({ targetWords, submittedWords, msElapsed, handleNewGame }) {
  const { sec, min, ms } = formatTime(msElapsed)
  const wordCount = targetWords.length
  const targetCharCount = targetWords.reduce((acc, word) => acc + word.length, 0)
  const wordsPerSec = 1000 * wordCount / msElapsed
  const charsPerSec = 1000 * targetCharCount / msElapsed
  const submittedCharCount = submittedWords.reduce((acc, word) => acc + word.split(" ").length, 0)
  const accuracy = countCorrectChars(targetWords, submittedWords) / submittedCharCount

  return (
    <div className="size-full absolute flex flex-col gap-8 items-center justify-center bg-black/80">
      <div className="p-12 gap-8 flex flex-col rounded-xl bg-white">
        <h1 className="text-4xl">Results:</h1>
        <div className="flex gap-8">
          <div className="flex flex-1 flex-col items-center rounded-xl border py-6 px-8">
            <div className="text-6xl">{min}:{sec}<span className="text-4xl">.{ms}</span></div>
            <div className="flex gap-8 text-lg">
              <p>{wordCount} words</p>
              <p>{targetCharCount} chars</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2 rounded-xl border py-6 px-8">
            <h2>Your accuracy is:</h2>
            <p className="self-center text-6xl">{(accuracy*100).toFixed(1)}%</p>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="flex flex-1 flex-col gap-2 rounded-xl border py-6 px-8">
            <h2>Your Characters Per Second is:</h2>
            <p className="self-center text-6xl">{charsPerSec.toFixed(2)} CPS</p>
          </div>
          <div className="flex flex-1 flex-col gap-2 rounded-xl border py-6 px-8">
            <h2>Your Words Per Second is:</h2>
            <p className="self-center text-6xl">{wordsPerSec.toFixed(2)} WPS</p>
          </div>
        </div>
      </div>
      <button className="px-6 py-2 bg-white rounded-lg text-xl hover:bg-gray-300" onClick={handleNewGame} >New Game</button>
    </div>
  )
}