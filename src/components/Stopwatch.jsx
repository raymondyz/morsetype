export default function Stopwatch({ msElapsed }) {
  const sec = Math.floor((msElapsed / 1000) % 60).toString().padStart(2, "0")
  const min = Math.floor((msElapsed / (1000 * 60))).toString().padStart(2, "0")
  const ms = Math.floor((msElapsed / 10) % 100).toString().padStart(2, "0")

  return (
    <div className="text-6xl">
      {min}:{sec}<span className="text-4xl">.{ms}</span>
    </div>
  )
}