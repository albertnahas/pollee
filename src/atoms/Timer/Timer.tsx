import React, { FC, useEffect, useRef, useState } from "react"

export const Timer: FC<Props> = ({
  startingTime,
  active,
  onTimerStop,
  countdown,
  endtime = 0,
  onTimeChange,
}) => {
  const time = useRef(startingTime || 0)
  const [timeRef, setTimeRef] = useState(startingTime || 0)

  const endTime = useRef(endtime || 0)

  useEffect(() => {
    const timer = setInterval(() => {
      if (!active || (countdown && time.current >= endTime.current)) {
        clearInterval(timer)
        // Finish
        onTimerStop?.(time.current)
      } else {
        time.current += 1
        setTimeRef(time.current)
        onTimeChange?.(time.current)
      }
    }, 1000)

    return () => {
      clearInterval(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  useEffect(() => {
    time.current = startingTime || 0
    setTimeRef(time.current)
    onTimeChange?.(time.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startingTime])

  useEffect(() => {
    endTime.current = endtime || 0
  }, [endtime])

  const displayTime = () =>
    countdown
      ? new Date(Math.max(endtime - timeRef, 0) * 1000)
          .toISOString()
          .substr(14, 5)
      : new Date(timeRef * 1000).toISOString().substr(14, 5)

  return (
    <span aria-label="timer" className="timer">
      {displayTime()}
    </span>
  )
}

interface Props {
  startingTime?: number
  active: boolean
  countdown?: boolean
  endtime?: number
  onTimerStop?: (elapsedTime: number) => void
  onTimeChange?: (time: number) => void
}
