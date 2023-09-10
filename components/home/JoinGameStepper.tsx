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

const JoinGameStepper = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  const [activeStep, setActiveStep] = useState(0)
  const [gameCode, setGameCode] = useState("")
  const [username, setUsername] = useState("")
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [players, setPlayers] = useState<string[]>([])
  const [gameEnded, setGameEnded] = useState(false)

  const handleJoinGame = () => {
    if (!socket) {
      if (process.env.NEXT_PUBLIC_AMPLIFY_WS_URL == null) {
        throw "websocket url is not defined in environment"
      }
      const ws = new WebSocket(process.env.NEXT_PUBLIC_AMPLIFY_WS_URL);
      ws.onopen = () => {
        const gameData = {
          action: "joinGame",
          gameCode: gameCode,
          username: username,
        }
        ws.send(JSON.stringify(gameData))
      }
      setSocket(ws)
    } else {
      const gameData = {
        action: "joinGame",
        gameCode: gameCode,
        username: username,
      }
      socket.send(JSON.stringify(gameData))
    }
  }

  const handleCloseDialog = () => {
    sendLeaveGameMessage()
    setGameCode("")
    setUsername("")
    setActiveStep(0)
    onClose()
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

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.action === "updatePlayers") {
          setPlayers(data.players)
        } else if (data.action === "gameEnded") {
          setGameEnded(true)
        }
      }
    }
  }, [socket])

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

  return (
    <Dialog open={open} onClose={handleCloseDialog} sx={dialogStyles}>
      <CloseDialogButton onClose={handleCloseDialog} />
      <DialogContent sx={contentStyles}>
        {gameEnded ? (
          <GameEndedContent />
        ) : activeStep === 0 ? (
          <EnterUsernameAndGameCodeInput
            gameCode={gameCode}
            setGameCode={setGameCode}
            username={username}
            setUsername={setUsername}
          />
        ) : (
          <JoiningContent players={players} />
        )}
      </DialogContent>
      {!gameEnded && (
        <StepperActions
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          username={username}
          gameCode={gameCode}
          handleJoinGame={handleJoinGame}
          sendLeaveGameMessage={sendLeaveGameMessage}
        />
      )}
    </Dialog>
  )
}

const GameEndedContent = () => (
  <Box
    display="flex"
    flexDirection={"column"}
    justifyContent="center"
    alignItems={"center"}
  >
    <Typography variant="h6">The host has ended the game.</Typography>
  </Box>
)

const CloseDialogButton = ({ onClose }: { onClose: () => void }) => (
  <IconButton
    aria-label="close"
    style={{ position: "absolute", top: 8, left: 8 }}
    onClick={onClose}
  >
    <CloseIcon />
  </IconButton>
)

const EnterUsernameAndGameCodeInput = ({
  gameCode,
  setGameCode,
  username,
  setUsername,
}: {
  gameCode: string
  setGameCode: React.Dispatch<React.SetStateAction<string>>
  username: string
  setUsername: React.Dispatch<React.SetStateAction<string>>
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

const JoiningContent = ({ players }: { players: string[] }) => {
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

const StepperActions = ({
  activeStep,
  setActiveStep,
  username,
  gameCode,
  handleJoinGame,
  sendLeaveGameMessage,
}: {
  activeStep: number
  setActiveStep: React.Dispatch<React.SetStateAction<number>>
  username: string
  gameCode: string
  handleJoinGame: () => void
  sendLeaveGameMessage: () => void
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
            sendLeaveGameMessage()
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
