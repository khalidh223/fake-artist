"use client"
import { useState, useEffect } from "react"
import {
  Button,
  Typography,
  Dialog,
  IconButton,
  DialogContent,
  DialogActions,
  MobileStepper,
  Box,
  TextField,
  CircularProgress,
  Tooltip,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import fetchGameCode from "@/utils/fetchGameCode"
import { useRouter } from "next/navigation"
import { useDrawSocket } from "../../app/DrawSocketProvider"
import { useUser } from "@/app/UserProvider"
import { sendWebSocketMessage } from "../canvas/utils"

const StartNewGameStepper = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  const router = useRouter()

  const [activeStep, setActiveStep] = useState(0)
  const [hasFetchedGameCode, setHasFetchedGameCode] = useState(false)
  const [isStartingGame, setIsStartingGame] = useState(false)

  const {
    username,
    setUsername,
    playerSocket,
    setPlayerSocket,
    setConnectionId,
    setGameCode,
    gameCode,
  } = useUser()
  const [loading, setLoading] = useState(false)
  const [players, setPlayers] = useState<string[]>([])

  const drawSocket = useDrawSocket()

  useEffect(() => {
    if (shouldFetchGameCode()) {
      initiateGameCodeFetch()
    }
  }, [activeStep, hasFetchedGameCode])

  useEffect(() => {
    if (!drawSocket) return

    drawSocket.on("error", (error) => {
      console.error("Socket used for drawing encountered the error:", error)
    })

    const handleGameStarted = () => {
      router.push(`/canvas?gameCode=${gameCode}`)
    }

    drawSocket.on("gameStarted", handleGameStarted)

    return () => {
      drawSocket.off("gameStarted", handleGameStarted)
    }
  }, [gameCode, drawSocket])

  useEffect(() => {
    if (gameCode && gameCode.trim() !== "") {
      const gameData = {
        action: "createGame",
        gameCode: gameCode,
        username: username,
      }

      if (!playerSocket) {
        if (process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT == null) {
          throw "When starting a new game, found that websocket URL was not defined in this environment"
        }
        const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT)

        ws.onopen = () => {
          ws.send(JSON.stringify(gameData))
          if (!players.includes(username)) {
            setPlayers((prevPlayers) => [...prevPlayers, username])
          }
        }

        setPlayerSocket(ws)
      } else {
        playerSocket.send(JSON.stringify(gameData))
        if (!players.includes(username)) {
          setPlayers((prevPlayers) => [...prevPlayers, username])
        }
      }
    }
  }, [gameCode])

  useEffect(() => {
    const handleOnMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data)
      switch (data.action) {
        case "updatePlayers":
          setPlayers(data.players)
          break
        case "gameLeft":
          setPlayers((prevPlayers) =>
            prevPlayers.filter((p) => p !== data.username)
          )
          break
        case "connectionEstablished":
          setConnectionId(data.connectionId)
          break
        default:
          console.error(`Unhandled message action: ${data.action}`)
      }
    }

    if (playerSocket) {
      playerSocket.onmessage = handleOnMessage
    }

    return () => {
      if (playerSocket) {
        playerSocket.onmessage = null
      }
    }
  }, [playerSocket])

  const startGame = () => {
    if (!gameCode || !drawSocket) return

    drawSocket.emit("joinGame", gameCode)
    drawSocket.emit("startGame", gameCode)

    sendWebSocketMessage(playerSocket, {
      action: "updateGameInProgressStatus",
      gameCode,
      isInProgress: true,
    })
  }

  const shouldFetchGameCode = () => activeStep === 1 && !hasFetchedGameCode

  const initiateGameCodeFetch = () => {
    fetchGameCode(setGameCode, setHasFetchedGameCode, setLoading, username)
  }

  const handleCloseDialog = () => {
    resetStates()
    onClose()
  }

  const resetStates = () => {
    if (playerSocket) {
      const leaveGameData = {
        action: "leaveGame",
        gameCode: gameCode,
        username: username,
      }
      playerSocket.send(JSON.stringify(leaveGameData))
      playerSocket.close()
      setPlayerSocket(null)
    }

    setGameCode("")
    setUsername("")
    setPlayers([])
    setActiveStep(0)
    setHasFetchedGameCode(false)
  }

  const nextButtonOnClick = () => {
    if (activeStep === 0) {
      setHasFetchedGameCode(false)
    }
    if (activeStep === 1) {
      setIsStartingGame(true)
      startGame()
    }
    setActiveStep(activeStep + 1)
  }

  const dialogStyles = {
    "& .MuiPaper-root": {
      backgroundColor: "#73053C",
      color: "#fff",
      width: "80%",
      maxWidth: "400px",
    },
    "& .MuiMobileStepper-dotActive": {
      backgroundColor: "#F10A7E",
    },
  }

  const contentStyles = {
    minHeight: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  }

  const getDialogContent = () => {
    if (activeStep === 0) {
      return <EnterUsernameInput value={username} onChange={setUsername} />
    }
    if (loading) {
      return <LoadingGameCode />
    }
    return <DisplayGameCode gameCode={gameCode} players={players} />
  }

  return (
    <div>
      <Dialog open={open} onClose={handleCloseDialog} sx={dialogStyles}>
        <CloseDialogButton onClose={handleCloseDialog} />
        <DialogContent sx={contentStyles}>{getDialogContent()}</DialogContent>
        <StepperActions
          activeStep={activeStep}
          username={username}
          resetStates={resetStates}
          players={players}
          nextButtonOnClick={nextButtonOnClick}
          isStartingGame={isStartingGame}
        />
      </Dialog>
    </div>
  )
}

const CloseDialogButton = ({ onClose }: { onClose: () => void }) => (
  <IconButton
    aria-label="close"
    style={{ position: "absolute", top: 8, left: 8 }}
    onClick={onClose}
  >
    <CloseIcon />
  </IconButton>
)

const EnterUsernameInput = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => {
  const inputProps = {
    style: {
      color: "white",
      borderBottom: "1px solid white",
    },
    inputProps: {
      style: {
        color: "white",
      },
    },
  }

  return (
    <Box
      display="flex"
      flexDirection={"column"}
      justifyContent="center"
      alignItems={"center"}
    >
      <Typography variant="h6">Enter your username!</Typography>
      <TextField
        variant="standard"
        placeholder="Username"
        margin="normal"
        InputProps={inputProps}
        value={value}
        fullWidth
        onChange={(e) => onChange(e.target.value)}
      />
    </Box>
  )
}

const LoadingGameCode = () => (
  <Box
    display="flex"
    flexDirection={"column"}
    justifyContent="center"
    alignItems={"center"}
  >
    <Typography variant="h6" mb={2}>
      Your game code is:
    </Typography>
    <CircularProgress color="inherit" />
  </Box>
)

const DisplayGameCode = ({
  gameCode,
  players,
}: {
  gameCode: string
  players: string[]
}) => (
  <Box
    display="flex"
    flexDirection={"column"}
    justifyContent="center"
    alignItems={"center"}
  >
    <Typography variant="h6" mb={2}>
      Your game code is:
    </Typography>
    <Typography variant="h4" fontWeight="bold" gutterBottom>
      {gameCode}
    </Typography>
    <Typography variant="h6" mt={2} mb={1}>
      Players:
    </Typography>
    <>
      {players.map((player) => (
        <div key={player}>{player}</div>
      ))}
    </>
  </Box>
)

const StepperActions = ({
  activeStep,
  username,
  resetStates,
  players,
  nextButtonOnClick,
  isStartingGame,
}: {
  activeStep: number
  username: string
  resetStates: () => void
  players: string[]
  nextButtonOnClick: () => void
  isStartingGame: boolean
}) => (
  <DialogActions sx={{ flexDirection: "column", alignItems: "center" }}>
    <MobileStepper
      variant="dots"
      steps={2}
      position="static"
      activeStep={activeStep}
      backButton={<BackButton activeStep={activeStep} onClick={resetStates} />}
      nextButton={
        <NextButton
          activeStep={activeStep}
          onClick={nextButtonOnClick}
          players={players}
          username={username}
          isStartingGame={isStartingGame}
        />
      }
    />
  </DialogActions>
)

const BackButton = ({
  activeStep,
  onClick,
}: {
  activeStep: number
  onClick: () => void
}) => (
  <Button
    size="small"
    onClick={onClick}
    disabled={activeStep === 0}
    sx={{ color: activeStep !== 0 ? "#fff" : "rgba(255, 255, 255, 0.38)" }}
  >
    Back
  </Button>
)

const NextButton = ({
  activeStep,
  onClick,
  players,
  username,
  isStartingGame,
}: {
  activeStep: number
  onClick: () => void
  players: string[]
  username: string
  isStartingGame: boolean
}) => {
  const canProceedFirstStep = username.trim()
  const canProceedSecondStep = username.trim() && players.length >= 5
  const isLastStep = activeStep >= 1
  const isDisabled =
    (activeStep === 0 && !canProceedFirstStep) ||
    (activeStep === 1 && !canProceedSecondStep)

  const buttonContent = isStartingGame ? (
    <CircularProgress size={24} sx={{ color: '#fff' }} />
  ) : isLastStep ? (
    "Start!"
  ) : (
    "Next"
  )

  const button = (
    <Button
      size="small"
      onClick={onClick}
      disabled={isDisabled || isStartingGame}
      sx={{
        color:
          !isDisabled && !isStartingGame ? "#fff" : "rgba(255, 255, 255, 0.38)",
      }}
    >
      {buttonContent}
    </Button>
  )

  if (isLastStep && players.length < 5) {
    return (
      <Tooltip title="Need at least 5 players to start!">
        <span>{button}</span>
      </Tooltip>
    )
  }

  return button
}

export default StartNewGameStepper
