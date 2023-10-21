"use client"

import React, { useEffect, useState } from "react"
import DrawCanvas from "@/components/canvas/DrawCanvas"
import Border from "./Border"
import { Box, Typography, Backdrop, Chip, Alert } from "@mui/material"
import { styled } from "@mui/system"
import { useUser } from "@/app/UserProvider"

const THEME_COLOR = "#DC1C74"
const BORDER_COLOR = "#000000"
const colors = [
  { hex: "#000000", penColor: "black" },
  { hex: "#954A13", penColor: "brown" },
  { hex: "#005AA7", penColor: "darkblue" },
  { hex: "#BE228B", penColor: "darkpink" },
  { hex: "#006F66", penColor: "green" },
  { hex: "#00AEEB", penColor: "lightblue" },
  { hex: "#76CAA1", penColor: "lightgreen" },
  { hex: "#FF8335", penColor: "orange" },
  { hex: "#FB108B", penColor: "pink" },
  { hex: "#4F4E9D", penColor: "purple" },
  { hex: "#FC212E", penColor: "red" },
  { hex: "#FFF144", penColor: "yellow" },
]

const Sketchpad = ({
  canvasWebSocket,
  title,
  theme,
  exittedTitleCard,
}: {
  canvasWebSocket: WebSocket | null
  title: string
  theme: string
  exittedTitleCard: boolean
}) => {
  return (
    <StyledSketchpadBox>
      <ThemeAndTitleBox
        title={title}
        theme={theme}
        exittedTitleCard={exittedTitleCard}
      />
      <ContentBox canvasWebSocket={canvasWebSocket} />
    </StyledSketchpadBox>
  )
}

type StyledSketchpadBoxProps = {
  children: React.ReactNode
}

const StyledSketchpadBox = ({ children }: StyledSketchpadBoxProps) => (
  <Box
    sx={{
      width: "33%",
      maxWidth: "500px",
      height: "80vh",
      bgcolor: "white",
      position: "relative",
      p: 2,
      m: 4,
      borderTop: `0 solid transparent`,
      borderLeft: `0 solid transparent`,
      borderBottom: `15px solid ${BORDER_COLOR}`,
      borderRight: `15px solid ${BORDER_COLOR}`,
    }}
  >
    {children}
  </Box>
)

const ThemeAndTitleBox = ({
  title,
  theme,
  exittedTitleCard,
}: {
  title: string
  theme: string
  exittedTitleCard: boolean
}) => (
  <Box
    sx={{
      color: THEME_COLOR,
      mb: 1,
      padding: 0,
    }}
  >
    <Typography variant="subtitle1" gutterBottom>
      Theme: {exittedTitleCard ? theme : null}
    </Typography>
    <Box
      component="hr"
      sx={{ borderColor: THEME_COLOR, m: 0, mb: 1, width: "100%" }}
    />
    <Typography variant="subtitle1">
      Title: {exittedTitleCard ? (title != "" ? title : "???") : null}
    </Typography>
  </Box>
)

const PositionedBox = styled(Box)({
  position: "relative",
  width: "100%",
  height: "100%",
})

const ContentBox = ({
  canvasWebSocket,
}: {
  canvasWebSocket: WebSocket | null
}) => {
  const {
    currentPlayerDrawing,
    username,
    closeSlidingImage,
    playerToConfirmedHexColor,
    questionMaster,
    setShowQMChip,
    showQMChip,
    allPlayersConfirmedColor,
    themeChosenByQuestionMaster,
    titleChosenByQuestionMaster,
  } = useUser()

  enum OverlayStatuses {
    CLOSED,
    OPEN_CURRENT_PLAYER,
    OPEN_YOUR_TURN,
  }

  const [overlayStatus, setOverlayStatus] = useState<OverlayStatuses>(
    OverlayStatuses.CLOSED
  )
  const [isYourTurn, setIsYourTurn] = useState(false)
  const [alert, setAlert] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  })
  const [closedQMChip, setClosedQMChip] = useState(false)

  const handleBoxClick = () => {
    if (username !== currentPlayerDrawing && username !== questionMaster) {
      setAlert({ show: true, message: "It's not your turn to draw!" })
    } else if (username === questionMaster) {
      setAlert({
        show: true,
        message: "As the Question Master, you won't be drawing!",
      })
    }
  }

  const closeAlert = () => {
    setAlert({ ...alert, show: false })
  }

  const youAreNotCurrentlyDrawing = currentPlayerDrawing !== username
  const youClosedTheTitleCard = closeSlidingImage
  const youAreTheQuestionMaster = username === questionMaster
  const themeAndTitleChosenByQuestionMaster =
    themeChosenByQuestionMaster != "" && titleChosenByQuestionMaster != ""

  const canOpenCurrentPlayerDrawingOverlay = () => {
    return (
      (youAreNotCurrentlyDrawing &&
        youClosedTheTitleCard &&
        allPlayersConfirmedColor) ||
      (youAreTheQuestionMaster &&
        showQMChip &&
        allPlayersConfirmedColor &&
        themeAndTitleChosenByQuestionMaster) ||
      (youAreTheQuestionMaster &&
        closedQMChip &&
        allPlayersConfirmedColor &&
        themeAndTitleChosenByQuestionMaster)
    )
  }

  const youAreCurrentlyDrawing = currentPlayerDrawing === username

  const canOpenYourTurnOverlay = () => {
    return (
      youAreCurrentlyDrawing &&
      youClosedTheTitleCard &&
      allPlayersConfirmedColor
    )
  }

  useEffect(() => {
    if (canOpenCurrentPlayerDrawingOverlay()) {
      setOverlayStatus(OverlayStatuses.OPEN_CURRENT_PLAYER)
      const timer = setTimeout(() => {
        setOverlayStatus(OverlayStatuses.CLOSED)
      }, 3000)
      return () => clearTimeout(timer)
    } else if (canOpenYourTurnOverlay()) {
      setOverlayStatus(OverlayStatuses.OPEN_YOUR_TURN)
      const timer = setTimeout(() => {
        setOverlayStatus(OverlayStatuses.CLOSED)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [
    currentPlayerDrawing,
    username,
    closeSlidingImage,
    questionMaster,
    showQMChip,
    closedQMChip,
  ])

  useEffect(() => {
    setIsYourTurn(youAreCurrentlyDrawing)
  }, [currentPlayerDrawing, username])

  const hexColorOfCurrentPlayerDrawing =
    playerToConfirmedHexColor[currentPlayerDrawing]
  const penColorOfCurrentPlayerDrawing = colors.find(
    (color) => color.hex === hexColorOfCurrentPlayerDrawing
  )?.penColor

  const handleDelete = () => {
    setShowQMChip(false)
    setClosedQMChip(true)
  }

  return (
    <Box
      sx={{
        position: "absolute",
        top: "90px",
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
      }}
    >
      <PositionedBox onClick={handleBoxClick}>
        <DrawCanvas canvasWebSocket={canvasWebSocket} />
        <Box
          sx={
            overlayStatus !== OverlayStatuses.CLOSED ||
            youAreTheQuestionMaster ||
            youAreNotCurrentlyDrawing
              ? {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  cursor: "not-allowed",
                }
              : null
          }
        >
          <Backdrop
            open={overlayStatus !== OverlayStatuses.CLOSED}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: (theme) => theme.zIndex.drawer + 1,
              color: "#fff",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          >
            {overlayStatus === OverlayStatuses.OPEN_CURRENT_PLAYER ? (
              <CurrentPlayerDrawingOverlay
                currentPlayerDrawing={currentPlayerDrawing}
                penColorOfCurrentPlayerDrawing={penColorOfCurrentPlayerDrawing}
              />
            ) : overlayStatus === OverlayStatuses.OPEN_YOUR_TURN ? (
              <YourTurnDrawingOverlay />
            ) : null}
          </Backdrop>
        </Box>
      </PositionedBox>
      <Border position="top" />
      <Border position="bottom" />
      <Border position="left" />
      <Border position="right" />
      {youAreTheQuestionMaster && showQMChip ? (
        <QMChip handleDelete={handleDelete} />
      ) : null}
      {alert.show && (
        <Box
          sx={{
            position: "fixed",
            bottom: "2em",
            left: "3em",
            right: "3em",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Alert severity="info" onClose={closeAlert}>
            {alert.message}
          </Alert>
        </Box>
      )}
    </Box>
  )
}

const CurrentPlayerDrawingOverlay = ({
  currentPlayerDrawing,
  penColorOfCurrentPlayerDrawing,
}: {
  currentPlayerDrawing: string
  penColorOfCurrentPlayerDrawing: string | undefined
}) => {
  return (
    <>
      <img src="/player.png" alt="player image" />
      <Typography sx={{ mx: 2 }} color={"black"}>
        {currentPlayerDrawing} now drawing
      </Typography>
      <img
        src={`/${penColorOfCurrentPlayerDrawing}.png`}
        alt="color of player drawing"
      />
    </>
  )
}

const YourTurnDrawingOverlay = () => {
  return (
    <>
      <img src="/player.png" alt="player image" />
      <Typography sx={{ mx: 2 }} color={"black"}>
        Your turn!
      </Typography>
    </>
  )
}

const QMChip = ({ handleDelete }: { handleDelete: () => void }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "2em",
        left: "3em",
        right: "3em",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <Chip
        label="As the Question Master, you won't be drawing. Sit back and watch the show!"
        color="primary"
        onDelete={handleDelete}
        size="medium"
        sx={{ fontSize: "20px", color: "white" }}
      />
    </Box>
  )
}

export default Sketchpad
