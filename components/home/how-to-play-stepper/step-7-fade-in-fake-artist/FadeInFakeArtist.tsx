import { Box, DialogContent, DialogTitle } from "@mui/material"
import React from "react"
import { DialogTitleBox } from "../step-6-qm-count-down/DialogTitleBox"
import { PlayersGrid } from "../step-6-qm-count-down/PlayersGrid"

const FadeInFakeArtist = () => {
  const penColorToPoints = { red: 0, green: 2, blue: 1, "#AA336A": 1 }

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
        <DialogTitleBox countdownMessage={"3, 2, 1, pick!"} />
      </DialogTitle>
      <DialogContent>
        <PlayersGrid penColorToPoints={penColorToPoints} isLastStep={true} />
      </DialogContent>
    </Box>
  )
}

export default FadeInFakeArtist
