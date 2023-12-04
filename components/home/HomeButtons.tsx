"use client"
import { Button, Stack, styled } from "@mui/material"
import React, { useState } from "react"
import StartNewGameStepper from "./StartNewGameStepper"
import JoinGameStepper from "./JoinGameStepper"

const HomeButton = styled(Button)({
  borderColor: "#F10A7E",
  color: "#F10A7E",
  "&:hover": {
    borderColor: "#FFF000",
  },
})

const HomeButtons = () => {
  const [dialogNewGameOpen, setNewGameDialogOpen] = useState(false)
  const [dialogJoinGameOpen, setJoinGameDialogOpen] = useState(false)
  const handleNewGameOpenDialog = () => {
    setNewGameDialogOpen(true)
  }

  const handleNewGameCloseDialog = () => {
    setNewGameDialogOpen(false)
  }

  const handleJoinGameOpenDialog = () => {
    setJoinGameDialogOpen(true)
  }

  const handleJoinGameCloseDialog = () => {
    setJoinGameDialogOpen(false)
  }
  return (
    <>
      <Stack spacing={2} mt={4} width={"100%"}>
        <HomeButton
          fullWidth
          variant={"outlined"}
          onClick={handleNewGameOpenDialog}
        >
          Start new game
        </HomeButton>
        <HomeButton
          fullWidth
          variant={"outlined"}
          onClick={handleJoinGameOpenDialog}
        >
          Join game
        </HomeButton>
      </Stack>
      {dialogNewGameOpen ? (
        <StartNewGameStepper
          open={dialogNewGameOpen}
          onClose={handleNewGameCloseDialog}
        />
      ) : null}
      {dialogJoinGameOpen ? (
        <JoinGameStepper
          open={dialogJoinGameOpen}
          onClose={handleJoinGameCloseDialog}
        />
      ) : null}
    </>
  )
}

export default HomeButtons
