import { toDisplay, toMorse } from "../utils"
import { KEYBOARD } from "../utils"

import clsx from "clsx"

function DictKeyCap({ symbol, morse }) {
  return (
    <div className="h-16 w-16 flex flex-col justify-center items-center border rounded-lg">
      <p className="font-mono text-lg/tight font-bold m-0">{symbol}</p>
      <p className={clsx("font-mono leading-tight", morse.length > 4 ? "text-sm tracking-wider" : "text-md tracking-wide")}>{morse}</p>
    </div>
  )
}

export default function DictKeyboard() {
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