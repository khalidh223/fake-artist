"use client"

import { useUser } from "@/app/UserProvider"
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  styled,
} from "@mui/material"
import { useRouter } from "next/navigation"
import React, { Dispatch, SetStateAction } from "react"

const StyledButton = styled(Button)({
  borderColor: "#F10A7E",
  color: "#F10A7E",
})

const HostEndedGameDialog: React.FC<{
  playerSocket: WebSocket | null
  setHostEndedGame: Dispatch<SetStateAction<boolean>>
}> = ({ playerSocket, setHostEndedGame }) => {
  const router = useRouter()
  const {
    setRole,
    setPlayerSocket,
    setUsername,
    setConnectionId,
    setCanvasDimensions,
    setThemeChosenByQuestionMaster,
    setTitleChosenByQuestionMaster,
    setQuestionMaster,
    setPlayerToConfirmedHexColor,
    setCurrentPlayerDrawing,
    setPlayers,
    setAllPlayersConfirmedColor,
    setGameEnded,
    setPlayerToNumberOfFakeArtistVotes,
    setFakeArtist,
    setPlayerToNumberOfTwoCoins,
    setPlayerToNumberOfOneCoins,
    setFakeArtistGuessAndActualTitle,
    setAllPlayersResettedRoundState,
    setHexCodeOfColorChosen,
    setCloseSlidingImage,
    setShowQMChip,
    setExittedTitleCard,
    setCanvasBitmapAtEndOfGame,
  } = useUser()

  const resetLocalStateAfterGame = () => {
    setUsername("")
    setPlayerSocket(null)
    setConnectionId("")
    setCanvasDimensions({ width: 0, height: 0 })
    setPlayers(null)
    setHexCodeOfColorChosen(null)
    setQuestionMaster("")
    setCloseSlidingImage(false)
    setShowQMChip(false)
    setExittedTitleCard(false)
    setCanvasBitmapAtEndOfGame("")
    setPlayerToConfirmedHexColor({})
    setAllPlayersConfirmedColor(false)
    setThemeChosenByQuestionMaster("")
    setTitleChosenByQuestionMaster("")
    setCurrentPlayerDrawing("")
    setGameEnded(false)
    setPlayerToNumberOfFakeArtistVotes({})
    setFakeArtist("")
    setFakeArtistGuessAndActualTitle({
      fakeArtistGuess: "",
      actualTitle: "",
    })
    setPlayerToNumberOfTwoCoins({})
    setPlayerToNumberOfOneCoins({})
    setAllPlayersResettedRoundState(false)
    setHostEndedGame(false)
  }
  return (
    <Dialog open={true}>
      <DialogTitle>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginY={1}
          width="100%"
        >
          <Typography variant="h6" align="center">
            A player has left the game.
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <StyledButton
          variant="outlined"
          onClick={() => {
            setRole(null)
            playerSocket?.close()
            router.push("/")
            resetLocalStateAfterGame()
          }}
        >
          Return To Home
        </StyledButton>
      </DialogContent>
    </Dialog>
  )
}

export default HostEndedGameDialog
