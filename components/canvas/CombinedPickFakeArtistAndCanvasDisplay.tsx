"use client"

import React from "react"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import CanvasImageDisplay from "./CanvasImageDisplay"
import PickFakeArtist from "./PickFakeArtist"
import { useUser } from "@/app/UserProvider"

const CombinedPickFakeArtistAndCanvasDisplay = ({
  canvasWebSocket,
  imageDataUrl,
  gameCode,
}: {
  canvasWebSocket: WebSocket | null
  imageDataUrl: string
  gameCode: string
}) => {
  const { players, questionMaster } = useUser()
  const playersWithoutQuestionMaster = players?.filter(
    (player) => player != questionMaster
  )
  const numberOfPlayersIsLargerThanMinimum =
    playersWithoutQuestionMaster != undefined &&
    playersWithoutQuestionMaster.length > 4

  return (
    <Backdrop open={true} style={{ zIndex: 1300 }}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
        gap={5}
      >
        <Box
          bgcolor="white"
          borderRadius={2}
          paddingLeft={4}
          paddingRight={4}
          width={numberOfPlayersIsLargerThanMinimum ? "48em" : "40em"}
          height={numberOfPlayersIsLargerThanMinimum ? "35em" : "24em"}
        >
          <PickFakeArtist
            canvasWebSocket={canvasWebSocket}
            gameCode={gameCode}
            playersWithoutQuestionMaster={playersWithoutQuestionMaster}
          />
        </Box>
        <Box bgcolor="white" borderRadius={2}>
          <CanvasImageDisplay imageDataUrl={imageDataUrl} />
        </Box>
      </Box>
    </Backdrop>
  )
}

export default CombinedPickFakeArtistAndCanvasDisplay
