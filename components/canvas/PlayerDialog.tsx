"use client"

import {
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import PenPicker from "./PenPicker"
import { PenChosenData } from "@/app/canvas/page"
import { useUser } from "@/app/UserProvider"
import QuestionMasterSayingTheme from "./QuestionMasterSayingTheme"
import QuestionMasterThinking from "./QuestionMasterThinking"
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

const PlayerDialog = ({
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
    titleChosenByQuestionMaster,
  } = useUser()
  console.log("themeChosenByQuestionMaster: ", themeChosenByQuestionMaster)
  console.log("titleChosenByQuestionMaster: ", titleChosenByQuestionMaster)
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
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              You are a Player!
            </Typography>
            <img src="/player_large.png" alt="Image" width={120} height={173} />
            <Box mt={2} mb={2}>
              <Typography variant="body1" fontWeight={"bold"} gutterBottom>
                Find the Fake Artist!
              </Typography>
            </Box>
            <Box maxWidth={"20em"}>
              <Typography variant="body2" gutterBottom>
                The <strong>Question Master</strong> shares the title with all
                but one player — the <strong>Fake Artist.</strong> You get two
                rounds to make a single mark, <i>without</i> releasing your
                click. Earn points by identifying the Fake Artist!
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
          titleChosenByQuestionMaster={titleChosenByQuestionMaster}
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
  titleChosenByQuestionMaster,
}: {
  canRenderQuestionMasterAnimation: boolean
  themeChosenByQuestionMaster: string
  showSlidingImage: boolean
  handleAnimationEnd: () => void
  titleChosenByQuestionMaster: string
}) => {
  if (canRenderQuestionMasterAnimation) {
    if (themeChosenByQuestionMaster !== "") {
      if (showSlidingImage) {
        return <SlidingFlippingTitleCard title={titleChosenByQuestionMaster} />
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

export default PlayerDialog
