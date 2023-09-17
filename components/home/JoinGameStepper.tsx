"use client"

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  MobileStepper,
  TextField,
  Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import React, { useState, useEffect } from "react"
import GameCodeInput from "./GameCodeInput"
import { useRouter } from "next/navigation"
import { useSocket } from "../../app/SocketProvider"
import { Socket } from "socket.io-client"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"

const JoinGameStepper: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const router = useRouter()

  const drawSocket = useSocket()
  const [activeStep, setActiveStep] = useState(0)
  const [gameCode, setGameCode] = useState("")
  const [username, setUsername] = useState("")
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [players, setPlayers] = useState<string[]>([])
  const [gameEnded, setGameEnded] = useState(false)

  useEffect(
    () => handleDrawSocket(drawSocket, gameCode, router),
    [gameCode, drawSocket]
  )
  useEffect(
    () => handleSocketMessages(socket, setPlayers, setGameEnded),
    [socket]
  )

  const handleJoinGame = () => {
    initiateWebSocket(gameCode, username, drawSocket, setSocket, socket)
  }

  const sendLeaveGameMessage = () => {
    if (socket) {
      const leaveGameData = {
        action: "leaveGame",
        gameCode: gameCode,
        username: username,
      }
      socket.send(JSON.stringify(leaveGameData))
      socket.close()
      setSocket(null)
    }
  }

  const handleCloseDialog = () => {
    sendLeaveGameMessage()
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
          gameCode={gameCode}
          setGameCode={setGameCode}
          username={username}
          setUsername={setUsername}
        />
      </DialogContent>
      <StepperActions
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        username={username}
        gameCode={gameCode}
        handleJoinGame={handleJoinGame}
        socket={socket}
        setSocket={setSocket}
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

const handleSocketMessages = (
  socket: WebSocket | null,
  setPlayers: React.Dispatch<React.SetStateAction<string[]>>,
  setGameEnded: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (socket) {
    socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data)
      if (data.action === "updatePlayers") {
        setPlayers(data.players)
      } else if (data.action === "gameEnded") {
        setGameEnded(true)
      }
    }
  }
}

const initiateWebSocket = (
  gameCode: string,
  username: string,
  drawSocket: Socket | null,
  setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>,
  socket: WebSocket | null
) => {
  if (!socket) {
    if (process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT == null) {
      throw "When joining a game, found that websocket URL was not defined in this environment"
    }
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT)
    ws.onopen = () => {
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
    setSocket(ws)
  } else {
    const gameData = {
      action: "joinGame",
      gameCode: gameCode,
      username: username,
    }
    socket.send(JSON.stringify(gameData))
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

const DisplayContent: React.FC<any> = (props) => {
  if (props.gameEnded) return <GameEndedContent />
  if (props.activeStep === 0)
    return (
      <EnterUsernameAndGameCodeInput
        gameCode={props.gameCode}
        setGameCode={props.setGameCode}
        username={props.username}
        setUsername={props.setUsername}
      />
    )
  return <JoiningContent players={props.players} />
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

const EnterUsernameAndGameCodeInput: React.FC<any> = ({
  gameCode,
  setGameCode,
  username,
  setUsername,
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
        value={username}
        fullWidth
        onChange={(e) => setUsername(e.target.value)}
      />
      <Typography variant="h6" mt={4} mb={2}>
        Enter your game code!
      </Typography>
      <GameCodeInput gameCode={gameCode} setGameCode={setGameCode} />
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
  socket: WebSocket | null
  setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>
}

const StepperActions: React.FC<StepperActionsProps> = ({
  activeStep,
  setActiveStep,
  username,
  gameCode,
  handleJoinGame,
  socket,
  setSocket,
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
            if (socket) {
              const leaveGameData = {
                action: "leaveGame",
                gameCode: gameCode,
                username: username,
              }
              socket.send(JSON.stringify(leaveGameData))
              socket.close()
              setSocket(null)
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
        <Button
          size="small"
          onClick={() => {
            if (activeStep === 0) {
              handleJoinGame()
            }
            setActiveStep((prevStep) => prevStep + 1)
          }}
          sx={{ color: "#fff" }}
          disabled={!username.trim() || !gameCode.trim()}
        >
          {activeStep === 0 ? "Join" : null}
        </Button>
      }
    />
  </DialogActions>
)

export default JoinGameStepper