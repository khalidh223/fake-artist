import { Box, DialogContent, DialogTitle } from "@mui/material"
import React, { useEffect, useState } from "react"
import { DialogTitleBox } from "./DialogTitleBox"
import { PlayersGrid } from "./PlayersGrid"

const QMCountDown = () => {
  const [countdownMessage, setCountdownMessage] = useState<string>(
    "On the count of three, pick the fake artist!"
  )
  useEffect(() => initializeCountdown(), [])

  const initializeCountdown = () => {
    const countdownParts = ["3,", "2,", "1,", "pick!"]
    const initialDelay = 5000
    const interval = 1000

    const timer = setTimeout(() => {
      let currentPart = 0
      const countdownTimer = setInterval(() => {
        if (currentPart < countdownParts.length) {
          setCountdownMessage(
            countdownParts.slice(0, currentPart + 1).join(" ")
          )
          currentPart++
        } else {
          clearInterval(countdownTimer)
        }
      }, interval)
    }, initialDelay)

    return () => clearTimeout(timer)
  }

  const penColorToPoints = { red: 0, green: 0, blue: 0, "#AA336A": 0 }

  return (
    <Box
      bgcolor="white"
      borderRadius={2}
      paddingLeft={4}
      paddingRight={4}
      width={"33em"}
      height={"19em"}
    >
      <DialogTitle>
        <DialogTitleBox countdownMessage={countdownMessage} />
      </DialogTitle>
      <DialogContent>
        <PlayersGrid penColorToPoints={penColorToPoints} isLastStep={false} />
      </DialogContent>
    </Box>
  )
}

export default QMCountDown
