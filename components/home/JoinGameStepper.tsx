"use client"

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  MobileStepper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import React, { useState, useEffect, Dispatch, SetStateAction } from "react"
import GameCodeInput from "./GameCodeInput"
import { useRouter } from "next/navigation"
import { useDrawSocket } from "../../app/DrawSocketProvider"
import { Socket } from "socket.io-client"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"
import { useUser } from "@/app/UserProvider"
import { sendWebSocketMessage } from "../canvas/utils"

const JoinGameStepper: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const router = useRouter()

  const drawSocket = useDrawSocket()

  const [activeStep, setActiveStep] = useState(0)
  const {
    username,
    setUsername,
    playerSocket,
    setPlayerSocket,
    setConnectionId,
    gameCode,
    setGameCode,
  } = useUser()
  const [players, setPlayers] = useState<string[]>([])
  const [gameEnded, setGameEnded] = useState(false)
  const [gameCodeInvalidError, setGameCodeInvalidError] = useState<
    string | null
  >(null)
  const [usernameInUseError, setUsernameInUseError] = useState<string | null>(
    null
  )
  const [gameInProgressError, setGameInProgressError] = useState<string | null>(
    null
  )
  const [isValidationCheckLoading, setIsValidationCheckLoading] =
    useState(false)

  const [debouncedUsername, setDebouncedUsername] = useState(username)

  useEffect(() => {
    if (!playerSocket) {
      if (process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT == null) {
        throw Error("Websocket URL was not defined in this environment")
      }
      const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT)
      setPlayerSocket(ws)
    }
  }, [])

  useEffect(() => {
    if (username != "" || gameCode != "") {
      setIsValidationCheckLoading(true)

      const timer = setTimeout(() => {
        setIsValidationCheckLoading(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [username, gameCode])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUsername(username)
    }, 500) // 500 milliseconds delay

    return () => {
      clearTimeout(handler)
    }
  }, [username])

  useEffect(
    () => handleDrawSocket(drawSocket, gameCode, router),
    [gameCode, drawSocket]
  )
  useEffect(() => {
    return handlePlayerSocketMessages(
      playerSocket,
      setPlayers,
      setGameEnded,
      setConnectionId,
      setGameCodeInvalidError,
      setUsernameInUseError,
      setGameInProgressError
    )
  }, [playerSocket])

  useEffect(() => {
    if (gameCode.length < 6 && gameCodeInvalidError) {
      setGameCodeInvalidError(null)
    }

    if (usernameInUseError) {
      setUsernameInUseError(null)
    }

    if (gameInProgressError) {
      setGameInProgressError(null)
    }
  }, [username, gameCode])

  useEffect(() => {
    if (gameCode.length === 6) {
      checkGameCode(gameCode, playerSocket)
    }

    if (gameCode.length === 6 && debouncedUsername !== "") {
      checkUsernameExistsForGame(gameCode, debouncedUsername, playerSocket)
    }
  }, [gameCode, debouncedUsername])

  const checkGameCode = (gameCode: string, playerSocket: WebSocket | null) => {
    if (!playerSocket) {
      throw Error("No playerSocket saved when checking game code")
    } else {
      const data = {
        action: "checkGameCode",
        gameCode: gameCode,
      }
      playerSocket.send(JSON.stringify(data))
    }
  }

  const checkUsernameExistsForGame = (
    gameCode: string,
    username: string,
    playerSocket: WebSocket | null
  ) => {
    if (!playerSocket) {
      throw Error("No playerSocket saved when checking username")
    } else {
      const data = {
        action: "checkUsernameExistsForGame",
        gameCode: gameCode,
        username: username,
      }
      playerSocket.send(JSON.stringify(data))
    }
  }

  const handleJoinGame = () => {
    initiateWebSocket(
      gameCode,
      username,
      usernameInUseError,
      gameInProgressError,
      gameCodeInvalidError,
      drawSocket,
      setPlayerSocket,
      playerSocket
    )
  }

  const sendLeaveGameMessage = () => {
    if (!usernameInUseError && !gameInProgressError && !gameCodeInvalidError) {
      sendWebSocketMessage(playerSocket, {
        action: "leaveGame",
        gameCode: gameCode,
        username: username,
      })
    }
    playerSocket?.close()
    setPlayerSocket(null)
  }

  const handleCloseDialog = () => {
    if (!usernameInUseError && !gameInProgressError && !gameCodeInvalidError) {
      sendLeaveGameMessage()
    }
    setGameCode("")
    setUsername("")
    setActiveStep(0)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog} sx={dialogStyles}>
      <CloseDialogButton onClose={handleCloseDialog} />
      <DialogContent sx={contentStyles}>
        <DisplayContent
          gameEnded={gameEnded}
          activeStep={activeStep}
          players={players}
          setGameCode={setGameCode}
          username={username}
          setUsername={setUsername}
          gameCodeInvalidError={gameCodeInvalidError}
          usernameInUseError={usernameInUseError}
          gameInProgressError={gameInProgressError}
        />
      </DialogContent>
      <StepperActions
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        username={username}
        gameCode={gameCode}
        handleJoinGame={handleJoinGame}
        playerSocket={playerSocket}
        setPlayerSocket={setPlayerSocket}
        usernameInUseError={usernameInUseError}
        gameCodeInvalid={gameCodeInvalidError}
        gameInProgressError={gameInProgressError}
        isValidationCheckLoading={isValidationCheckLoading}
      />
    </Dialog>
  )
}

const handleDrawSocket = (
  drawSocket: Socket | null,
  gameCode: string,
  router: AppRouterInstance
) => {
  if (!drawSocket) return

  drawSocket.on("error", (error) => {
    console.error("Socket used for drawing encountered the error:", error)
  })

  drawSocket.on("gameStarted", () => {
    router.push(`/canvas?gameCode=${gameCode}`)
  })

  return () => {
    drawSocket.off("gameStarted")
  }
}

const handlePlayerSocketMessages = (
  playerSocket: WebSocket | null,
  setPlayers: React.Dispatch<React.SetStateAction<string[]>>,
  setGameEnded: React.Dispatch<React.SetStateAction<boolean>>,
  setConnectionId: React.Dispatch<React.SetStateAction<string>>,
  setGameCodeInvalidError: React.Dispatch<React.SetStateAction<string | null>>,
  setUsernameInUseError: React.Dispatch<React.SetStateAction<string | null>>,
  setGameInProgressError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const messageEventListener = (event: MessageEvent) => {
    const data = JSON.parse(event.data)
    switch (data.action) {
      case "updatePlayers":
        setPlayers(data.players)
        break
      case "gameEnded":
        setGameEnded(true)
        break
      case "gameLeft":
        setPlayers((prevPlayers) =>
          prevPlayers.filter((p) => p !== data.username)
        )
        break
      case "connectionEstablished":
        setConnectionId(data.connectionId)
        break
      case "gameCodeInvalid":
        setGameCodeInvalidError("Game code is invalid, please try again.")
        break
      case "usernameInUse":
        setUsernameInUseError(
          "Username is in use for this game, please provide a different username."
        )
        break
      case "gameInProgress":
        setGameInProgressError(
          "Game is already in progress, please provide a different game to join."
        )
        break
      default:
        console.error(`Unhandled message action: ${data.action}`)
    }
  }

  if (playerSocket) {
    playerSocket.addEventListener("message", messageEventListener)
  }

  return () => {
    if (playerSocket) {
      playerSocket.removeEventListener("message", messageEventListener)
    }
  }
}

const initiateWebSocket = (
  gameCode: string,
  username: string,
  usernameInUseError: string | null,
  gameInProgressError: string | null,
  gameCodeInvalidError: string | null,
  drawSocket: Socket | null,
  setPlayerSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>,
  playerSocket: WebSocket | null
) => {
  if (!playerSocket) {
    if (process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT == null) {
      throw "When joining a game, found that websocket URL was not defined in this environment"
    }
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT)
    ws.onopen = () => {
      if (
        gameCode.length === 6 &&
        username != "" &&
        usernameInUseError == null &&
        gameCodeInvalidError == null &&
        gameInProgressError == null
      ) {
        const gameData = {
          action: "joinGame",
          gameCode: gameCode,
          username: username,
        }
        ws.send(JSON.stringify(gameData))
        if (drawSocket) {
          drawSocket.emit("joinGame", gameCode)
        }
      }
    }
    setPlayerSocket(ws)
  } else {
    const gameData = {
      action: "joinGame",
      gameCode: gameCode,
      username: username,
    }
    playerSocket.send(JSON.stringify(gameData))
    if (drawSocket) {
      drawSocket.emit("joinGame", gameCode)
    }
  }
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

const CloseDialogButton: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <IconButton
    aria-label="close"
    style={{ position: "absolute", top: 8, left: 8 }}
    onClick={onClose}
  >
    <CloseIcon />
  </IconButton>
)

const DisplayContent = ({
  gameEnded,
  activeStep,
  players,
  setGameCode,
  username,
  setUsername,
  gameCodeInvalidError,
  usernameInUseError,
  gameInProgressError,
}: {
  gameEnded: boolean
  activeStep: number
  players: string[]
  setGameCode: Dispatch<SetStateAction<string>>
  username: string
  setUsername: Dispatch<SetStateAction<string>>
  gameCodeInvalidError: string | null
  usernameInUseError: string | null
  gameInProgressError: string | null
}) => {
  if (gameEnded) return <GameEndedContent />
  if (activeStep === 0)
    return (
      <EnterUsernameAndGameCodeInput
        setGameCode={setGameCode}
        username={username}
        setUsername={setUsername}
        gameCodeInvalidError={gameCodeInvalidError}
        usernameInUseError={usernameInUseError}
        gameInProgressError={gameInProgressError}
      />
    )
  return <JoiningContent players={players} />
}

const GameEndedContent: React.FC = () => (
  <Box
    display="flex"
    flexDirection={"column"}
    justifyContent="center"
    alignItems={"center"}
  >
    <Typography variant="h6">The host has ended the game.</Typography>
  </Box>
)

const EnterUsernameAndGameCodeInput = ({
  setGameCode,
  username,
  setUsername,
  gameCodeInvalidError,
  usernameInUseError,
  gameInProgressError,
}: {
  setGameCode: Dispatch<SetStateAction<string>>
  username: string
  setUsername: Dispatch<SetStateAction<string>>
  gameCodeInvalidError: string | null
  usernameInUseError: string | null
  gameInProgressError: string | null
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

  const setError = (
    gameCodeInvalidError: string | null,
    usernameInUseError: string | null,
    gameInProgressError: string | null
  ): string => {
    if (gameCodeInvalidError != null) {
      return gameCodeInvalidError
    } else if (usernameInUseError != null) {
      return usernameInUseError
    } else if (gameInProgressError != null) {
      return gameInProgressError
    } else {
      return ""
    }
  }

  const error = setError(
    gameCodeInvalidError,
    usernameInUseError,
    gameInProgressError
  )

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
        value={username}
        fullWidth
        onChange={(e) => setUsername(e.target.value)}
      />
      <Typography variant="h6" mt={4} mb={2}>
        Enter your game code!
      </Typography>
      <GameCodeInput setGameCode={setGameCode} />
      {error != "" && (
        <Typography style={{ color: "white", textAlign: "center" }} mt={"1em"}>
          {error}
        </Typography>
      )}
    </Box>
  )
}

const JoiningContent: React.FC<{ players: string[] }> = ({ players }) => {
  const [visibleDots, setVisibleDots] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleDots((prev) => (prev < 3 ? prev + 1 : 1))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <Box
      display="flex"
      flexDirection={"column"}
      justifyContent="center"
      alignItems={"center"}
    >
      <Typography variant="h6">
        Waiting for host to click start
        <span style={{ opacity: visibleDots > 0 ? 1 : 0 }}>.</span>
        <span style={{ opacity: visibleDots > 1 ? 1 : 0 }}>.</span>
        <span style={{ opacity: visibleDots > 2 ? 1 : 0 }}>.</span>
      </Typography>
      <Typography variant="h6" mt={2} mb={1}>
        Players:
      </Typography>
      {players.map((player, index) => (
        <Typography key={index}>{player}</Typography>
      ))}
    </Box>
  )
}

type StepperActionsProps = {
  activeStep: number
  setActiveStep: React.Dispatch<React.SetStateAction<number>>
  username: string
  gameCode: string
  handleJoinGame: () => void
  playerSocket: WebSocket | null
  setPlayerSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>
  usernameInUseError: string | null
  gameCodeInvalid: string | null
  gameInProgressError: string | null
  isValidationCheckLoading: boolean
}

const StepperActions: React.FC<StepperActionsProps> = ({
  activeStep,
  setActiveStep,
  username,
  gameCode,
  handleJoinGame,
  playerSocket,
  setPlayerSocket,
  usernameInUseError,
  gameCodeInvalid,
  gameInProgressError,
  isValidationCheckLoading,
}) => (
  <DialogActions sx={{ flexDirection: "column", alignItems: "center" }}>
    <MobileStepper
      variant="dots"
      steps={2}
      position="static"
      activeStep={activeStep}
      backButton={
        <Button
          size="small"
          onClick={() => {
            setActiveStep(0)
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
          }}
          sx={{
            color: activeStep !== 0 ? "#fff" : "rgba(255, 255, 255, 0.38)",
          }}
        >
          Back
        </Button>
      }
      nextButton={
        <Tooltip
          title={isValidationCheckLoading ? "Verifying fields..." : ""}
          arrow
        >
          <span>
            <Button
              size="small"
              onClick={() => {
                if (activeStep === 0) {
                  handleJoinGame()
                }
                setActiveStep((prevStep) => prevStep + 1)
              }}
              sx={{ color: "#fff", position: "relative" }}
              disabled={
                isValidationCheckLoading ||
                !username.trim() ||
                !gameCode.trim() ||
                gameCode.length !== 6 ||
                username.length === 0 ||
                usernameInUseError != null ||
                gameCodeInvalid != null ||
                gameInProgressError != null
              }
            >
              {isValidationCheckLoading ? (
                <CircularProgress
                  size={24}
                  sx={{ position: "absolute", color: "white" }}
                />
              ) : (
                activeStep === 0 && "Join"
              )}
            </Button>
          </span>
        </Tooltip>
      }
    />
  </DialogActions>
)

export default JoinGameStepper
