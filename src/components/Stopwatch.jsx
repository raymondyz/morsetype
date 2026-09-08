import { formatTime } from "../utils"

export default function Stopwatch({ msElapsed }) {
  const { sec, min, ms } = formatTime(msElapsed)

  return (
    <div className="text-6xl">
      {min}:{sec}<span className="text-4xl">.{ms}</span>
    </div>
  )
}