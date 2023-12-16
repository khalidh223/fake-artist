import { Box } from "@mui/material"
import React from "react"
import PlayerBox from "./PlayerBox"

export const PlayersGrid = ({
  penColorToPoints,
  isLastStep,
}: {
  penColorToPoints: { [color: string]: number }
  isLastStep: boolean
}) => {
  const players = []

  for (let [color, points] of Object.entries(penColorToPoints)) {
    players.push(
      <PlayerBox
        key={color}
        penColor={color}
        points={points}
        showLoserBubble={color === "green" && isLastStep}
      />
    )
  }
  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center" gap={4}>
        {players}
      </Box>
    </>
  )
}
