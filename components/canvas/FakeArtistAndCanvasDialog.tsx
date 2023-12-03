"use client"

import React, { useEffect, useState } from "react"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import CanvasImageDisplay from "./CanvasImageDisplay"
import PickFakeArtist from "./PickFakeArtist"
import {
  PlayerToNumberOfOneCoins,
  PlayerToNumberOfTwoCoins,
  useUser,
} from "@/app/UserProvider"
import QMAndFakeArtistWinDialog from "./QMAndFakeArtistWinDialog"
import FakeArtistCaught from "./FakeArtistCaught"
import { sendWebSocketMessage } from "./utils"
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material"
import { useDrawSocket } from "@/app/DrawSocketProvider"
import { styled } from "@mui/system"
import { useRouter } from "next/navigation"

const StyledButton = styled(Button)({
  borderColor: "#F10A7E",
  color: "#F10A7E",
})

const WinnerDialog = ({
  winner,
  resetState,
}: {
  winner: string
  resetState: () => void
}) => {
  const router = useRouter()
  return (
    <Dialog open={true} fullWidth>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <DialogTitle>Game Over! The winner is:</DialogTitle>
        <DialogContent>
          <img
            src={"/player_large.png"}
            alt="winner"
            width={150}
            height={227}
          />
          <Box
            mt={"0.5em"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography variant="h5" fontWeight={"bold"}>
              {winner}
            </Typography>
          </Box>
          <Box mt={"1em"}>
            <StyledButton
              variant="outlined"
              onClick={() => {
                router.push("/")
                router.refresh()
                resetState()
              }}
            >
              Return To Home
            </StyledButton>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  )
}

interface SwitchFakeArtistDialogProps {
  isPickFakeArtistVisible: boolean
  numberOfPlayersIsLargerThanMinimum: boolean
  canvasWebSocket: WebSocket | null
  gameCode: string
  playersWithoutQuestionMaster: string[] | undefined
  evaluateFakeArtistStatus: () => void
  fakeArtistLost: boolean
  fakeArtistWon: boolean
  fakeArtist: string
  questionMaster: string
  playersWithoutQMAndFakeArtist: string[] | undefined
  isFakeArtist: boolean
  handleExitDialog: () => void
}

const SwitchFakeArtistDialog: React.FC<SwitchFakeArtistDialogProps> = ({
  isPickFakeArtistVisible,
  numberOfPlayersIsLargerThanMinimum,
  canvasWebSocket,
  gameCode,
  playersWithoutQuestionMaster,
  evaluateFakeArtistStatus,
  fakeArtistLost,
  fakeArtistWon,
  fakeArtist,
  questionMaster,
  playersWithoutQMAndFakeArtist,
  isFakeArtist,
  handleExitDialog,
}) => {
  if (isPickFakeArtistVisible) {
    return (
      <PickFakeArtist
        canvasWebSocket={canvasWebSocket}
        gameCode={gameCode}
        playersWithoutQuestionMaster={playersWithoutQuestionMaster}
        evaluateFakeArtistStatus={evaluateFakeArtistStatus}
        fakeArtistLost={fakeArtistLost}
        fakeArtistWon={fakeArtistWon}
        numberOfPlayersIsLargerThanMinimum={numberOfPlayersIsLargerThanMinimum}
      />
    )
  } else if (!isPickFakeArtistVisible && fakeArtistWon) {
    return (
      <QMAndFakeArtistWinDialog
        fakeArtist={fakeArtist}
        questionMaster={questionMaster}
        handleExitDialog={handleExitDialog}
      />
    )
  } else if (!isPickFakeArtistVisible && fakeArtistLost) {
    return (
      <FakeArtistCaught
        numberOfPlayersIsLargerThanMinimum={numberOfPlayersIsLargerThanMinimum}
        playersWithoutQMAndFakeArtist={playersWithoutQMAndFakeArtist}
        isFakeArtist={isFakeArtist}
        canvasWebSocket={canvasWebSocket}
        gameCode={gameCode}
        handleExitDialog={handleExitDialog}
      />
    )
  }
  return <></>
}

const FakeArtistAndCanvasDialog = ({
  canvasWebSocket,
  imageDataUrl,
  gameCode,
}: {
  canvasWebSocket: WebSocket | null
  imageDataUrl: string
  gameCode: string
}) => {
  const {
    players,
    questionMaster,
    playerToNumberOfFakeArtistVotes,
    fakeArtist,
    username,
    playerToNumberOfOneCoins,
    playerToNumberOfTwoCoins,
    playerSocket,
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

  const drawSocket = useDrawSocket()

  const [isPickFakeArtistVisible, setIsPickFakeArtistVisible] = useState(true)
  const [fakeArtistLost, setFakeArtistLost] = useState<boolean>(false)
  const [fakeArtistWon, setFakeArtistWon] = useState<boolean>(false)
  const [exittedDialog, setExittedDialog] = useState(false)
  const [playerWithFiveOrMorePoints, setPlayerWithFiveOrMorePoints] = useState<
    string | null
  >(null)

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
  }

  const playersWithoutQuestionMaster = players?.filter(
    (player) => player != questionMaster
  )

  const playersWithoutQMAndFakeArtist = playersWithoutQuestionMaster?.filter(
    (player) => player != fakeArtist
  )

  useEffect(() => {
    if (fakeArtistLost || fakeArtistWon) {
      const timer = setTimeout(() => setIsPickFakeArtistVisible(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [fakeArtistLost, fakeArtistWon])

  useEffect(() => {
    if (fakeArtistWon && questionMaster != "") {
      setPlayerToNumberOfTwoCoins((prevPoints) => {
        const updatedPoints = { ...prevPoints }

        updatedPoints[fakeArtist] += 1
        updatedPoints[questionMaster] += 1

        return updatedPoints
      })
    }
  }, [fakeArtistWon])

  const evaluateFakeArtistStatus = () => {
    const isVoteMax = (vote: number, sortedVotes: number[]) =>
      vote === sortedVotes[0]
    const isVoteTied = (sortedVotes: number[]) =>
      sortedVotes[0] === sortedVotes[1]

    if (fakeArtist !== "") {
      const sortedVotes = Object.values(playerToNumberOfFakeArtistVotes).sort(
        (a, b) => b - a
      )
      const isLoser =
        isVoteMax(playerToNumberOfFakeArtistVotes[fakeArtist], sortedVotes) &&
        !isVoteTied(sortedVotes)
      const isWinner =
        !isVoteMax(playerToNumberOfFakeArtistVotes[fakeArtist], sortedVotes) ||
        isVoteTied(sortedVotes)

      setTimeout(() => {
        setFakeArtistLost(isLoser)
        setFakeArtistWon(isWinner)
      }, 2000)
    }
  }
  const numberOfPlayersIsLargerThanMinimum =
    playersWithoutQuestionMaster != undefined &&
    playersWithoutQuestionMaster.length > 4

  const handleExitDialog = () => {
    setExittedDialog(true)

    const searchForPlayerWithFiveOrMorePoints = findPlayerWithFiveOrMorePoints(
      playerToNumberOfOneCoins,
      playerToNumberOfTwoCoins
    )
    if (searchForPlayerWithFiveOrMorePoints != null) {
      setPlayerWithFiveOrMorePoints(searchForPlayerWithFiveOrMorePoints)
      leaveGame()
      disconnectSockets()
      return
    }

    sendWebSocketMessage(canvasWebSocket, {
      action: "resetRoundStateForPlayer",
      gameCode,
      username,
      currentQuestionMaster: questionMaster,
    })
  }

  const findPlayerWithFiveOrMorePoints = (
    playerToNumberOfOneCoins: PlayerToNumberOfOneCoins,
    playerToNumberOfTwoCoins: PlayerToNumberOfTwoCoins
  ): string | null => {
    const allPlayers = Array.from(
      new Set<string>([
        ...Object.keys(playerToNumberOfOneCoins),
        ...Object.keys(playerToNumberOfTwoCoins),
      ])
    )

    for (const player of allPlayers) {
      const numberOfOneCoins = playerToNumberOfOneCoins[player] || 0
      const numberOfTwoCoins = playerToNumberOfTwoCoins[player] || 0
      const totalPoints = numberOfOneCoins + 2 * numberOfTwoCoins

      if (totalPoints >= 5) {
        return player
      }
    }

    return null
  }

  const leaveGame = () => {
    sendWebSocketMessage(playerSocket, {
      action: "leaveGame",
      gameCode: gameCode,
      username: username,
    })
  }

  const disconnectSockets = () => {
    playerSocket?.close()
    canvasWebSocket?.close()
    setPlayerSocket(null)
  }

  if (exittedDialog && !playerWithFiveOrMorePoints) {
    return (
      <Backdrop open={true} style={{ zIndex: 1300 }}>
        <Typography variant="h5" fontWeight={"bold"} color={"white"}>
          Waiting for new round to start...
        </Typography>
      </Backdrop>
    )
  }

  if (exittedDialog && playerWithFiveOrMorePoints) {
    return (
      <WinnerDialog
        winner={playerWithFiveOrMorePoints}
        resetState={resetLocalStateAfterGame}
      />
    )
  }

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
        <SwitchFakeArtistDialog
          isPickFakeArtistVisible={isPickFakeArtistVisible}
          numberOfPlayersIsLargerThanMinimum={
            numberOfPlayersIsLargerThanMinimum
          }
          canvasWebSocket={canvasWebSocket}
          gameCode={gameCode}
          playersWithoutQuestionMaster={playersWithoutQuestionMaster}
          evaluateFakeArtistStatus={evaluateFakeArtistStatus}
          fakeArtistLost={fakeArtistLost}
          fakeArtistWon={fakeArtistWon}
          fakeArtist={fakeArtist}
          questionMaster={questionMaster}
          playersWithoutQMAndFakeArtist={playersWithoutQMAndFakeArtist}
          isFakeArtist={username === fakeArtist}
          handleExitDialog={handleExitDialog}
        />
        <Box bgcolor="white" borderRadius={2}>
          <CanvasImageDisplay imageDataUrl={imageDataUrl} />
        </Box>
      </Box>
    </Backdrop>
  )
}

export default FakeArtistAndCanvasDialog
