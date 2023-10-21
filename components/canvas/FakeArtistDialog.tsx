"use client"

import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Box,
  Backdrop,
} from "@mui/material"
import PenPicker from "./PenPicker"
import { PenChosenData } from "@/app/canvas/page"
import { useUser } from "@/app/UserProvider"
import QuestionMasterThinking from "./QuestionMasterThinking"
import QuestionMasterSayingTheme from "./QuestionMasterSayingTheme"
import SlidingFlippingTitleCard from "./SlidingFlippingTitleCard"

const sendWebSocketMessage = (socket: WebSocket | null, data: object) => {
  if (!socket) return

  const send = () => {
    socket.send(JSON.stringify(data))
  }

  if (socket.readyState === WebSocket.OPEN) {
    send()
  } else {
    socket.addEventListener("open", send)
    return () => {
      socket.removeEventListener("open", send)
    }
  }
}

const FakeArtistDialog = ({
  penChosen,
  canvasWebSocket,
  gameCode,
  allPlayersConfirmedColor,
}: {
  penChosen: PenChosenData | null
  canvasWebSocket: WebSocket | null
  gameCode: string
  allPlayersConfirmedColor: boolean
}) => {
  const {
    hexCodeOfColorChosen,
    username,
    themeChosenByQuestionMaster,
    setCurrentPlayerDrawing,
    players,
    questionMaster,
    closeSlidingImage,
    setCloseSlidingImage,
    setExittedTitleCard,
    currentPlayerDrawing,
  } = useUser()
  const [isOpen, setIsOpen] = useState(true)
  const [isBackDropOpen, setIsBackDropOpen] = useState(false)
  const [
    canRenderQuestionMasterAnimation,
    setCanRenderQuestionMasterAnimation,
  ] = useState(false)
  const [showSlidingImage, setShowSlidingImage] = useState(false)
  const handleAnimationEnd = () => {
    setTimeout(() => {
      setShowSlidingImage(true)
    }, 3000)
  }

  const handleExitCard = () => {
    if (players != null) {
      const sortedPlayers = players
        .sort()
        .filter((player) => player != questionMaster)
      setExittedTitleCard(true)
      if (currentPlayerDrawing == "") {
        setCurrentPlayerDrawing(sortedPlayers[0])
      }
      setCloseSlidingImage(true)
      setIsBackDropOpen(false)
    }
  }

  useEffect(() => {
    if (allPlayersConfirmedColor) {
      setCanRenderQuestionMasterAnimation(true)
    }
  }, [allPlayersConfirmedColor])

  const handleClick = () => {
    sendWebSocketMessage(canvasWebSocket, {
      action: "sendColorConfirmed",
      color: hexCodeOfColorChosen,
      gameCode,
      username,
    })
    setIsOpen(false)
    setIsBackDropOpen(true)
  }

  return (
    <>
      <Dialog open={isOpen} fullWidth maxWidth="xs">
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
          >
            <Box mt={2}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                You are the Fake Artist!
              </Typography>
            </Box>
            <img src="/fake_artist.png" alt="Image" width={120} height={173} />
            <Box mt={2} mb={2}>
              <Typography variant="body1" fontWeight={"bold"} gutterBottom>
                Fake it till you make it.
              </Typography>
            </Box>
            <Box maxWidth={"20em"}>
              <Typography variant="body2" gutterBottom>
                You will see the theme, but not the title - earn points by not
                getting caught, or by guessing the title correctly if caught!
              </Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="body1" fontWeight={"bold"} gutterBottom>
                Pick your color:
              </Typography>
            </Box>
            <Box mb={-4}>
              <PenPicker
                penChosen={penChosen}
                canvasWebSocket={canvasWebSocket}
              />
            </Box>
          </Box>
        </DialogContent>
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button
            variant="text"
            disabled={hexCodeOfColorChosen == null}
            onClick={handleClick}
          >
            Done
          </Button>
        </Box>
      </Dialog>
      <Backdrop
        open={isBackDropOpen}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <QuestionMasterAnimations
          canRenderQuestionMasterAnimation={canRenderQuestionMasterAnimation}
          themeChosenByQuestionMaster={themeChosenByQuestionMaster}
          showSlidingImage={showSlidingImage}
          handleAnimationEnd={handleAnimationEnd}
          handleExitCard={handleExitCard}
          closeSlidingImage={closeSlidingImage}
        />
      </Backdrop>
    </>
  )
}

const QuestionMasterAnimations = ({
  canRenderQuestionMasterAnimation,
  themeChosenByQuestionMaster,
  showSlidingImage,
  handleAnimationEnd,
  handleExitCard,
  closeSlidingImage,
}: {
  canRenderQuestionMasterAnimation: boolean
  themeChosenByQuestionMaster: string
  showSlidingImage: boolean
  handleAnimationEnd: () => void
  handleExitCard: () => void
  closeSlidingImage: boolean
}) => {
  if (canRenderQuestionMasterAnimation) {
    if (themeChosenByQuestionMaster !== "") {
      if (showSlidingImage) {
        return (
          !closeSlidingImage && (
            <SlidingFlippingTitleCard
              title={null}
              handleExitCard={handleExitCard}
            />
          )
        )
      } else {
        return (
          <QuestionMasterSayingTheme
            theme={themeChosenByQuestionMaster}
            onAnimationEnd={handleAnimationEnd}
          />
        )
      }
    } else {
      return <QuestionMasterThinking />
    }
  }
  return (
    <Typography variant="h5" fontWeight={"bold"}>
      Waiting for all players to select their pen...
    </Typography>
  )
}

export default FakeArtistDialog
