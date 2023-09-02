"use client"
import { useState, useEffect, SetStateAction } from "react"
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
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import fetchGameCode from "@/utils/fetchGameCode"

const StartNewGameStepper = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  const [activeStep, setActiveStep] = useState(0)
  const [gameCode, setGameCode] = useState<string | null>(null)
  const [hasFetchedGameCode, setHasFetchedGameCode] = useState(false)
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (shouldFetchGameCode()) {
      initiateGameCodeFetch()
    }
  }, [activeStep, hasFetchedGameCode])

  const shouldFetchGameCode = () => activeStep === 1 && !hasFetchedGameCode

  const initiateGameCodeFetch = () => {
    fetchGameCode(setGameCode, setHasFetchedGameCode, setLoading, username)
  }

  const handleCloseDialog = () => {
    onClose()
    resetDialogState()
  }

  const resetDialogState = () => {
    setActiveStep(0)
    setHasFetchedGameCode(false)
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
    return <DisplayGameCode gameCode={gameCode} />
  }

  return (
    <div>
      <Dialog open={open} onClose={handleCloseDialog} sx={dialogStyles}>
        <CloseDialogButton onClose={handleCloseDialog} />
        <DialogContent sx={contentStyles}>{getDialogContent()}</DialogContent>
        <StepperActions
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          username={username}
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

const DisplayGameCode = ({ gameCode }: { gameCode: string | null }) => (
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
  </Box>
)

const StepperActions = ({
  activeStep,
  setActiveStep,
  username,
}: {
  activeStep: number
  setActiveStep: SetStateAction<any>
  username: string
}) => (
  <DialogActions sx={{ flexDirection: "column", alignItems: "center" }}>
    <MobileStepper
      variant="dots"
      steps={2}
      position="static"
      activeStep={activeStep}
      backButton={
        <BackButton activeStep={activeStep} onClick={() => setActiveStep(0)} />
      }
      nextButton={
        <NextButton
          activeStep={activeStep}
          onClick={() => setActiveStep(1)}
          disabled={!username.trim()}
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
  disabled,
}: {
  activeStep: number
  onClick: () => void
  disabled: boolean
}) => (
  <Button
    size="small"
    onClick={onClick}
    disabled={activeStep === 1 || disabled}
    sx={{
      color:
        activeStep !== 1 && !disabled ? "#fff" : "rgba(255, 255, 255, 0.38)",
    }}
  >
    Next
  </Button>
)

export default StartNewGameStepper
