"use client"

import { Box, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import Bubble from "../../../canvas/Bubble"

const FadeInFakeArtistLostImage = ({
  isFakeArtist,
}: {
  isFakeArtist: boolean
}) => (
  <img
    src="/fake_artist_lost.png"
    alt="fake artist lost"
    style={{
      width: "100%",
      height: "100%",
      position: "absolute",
      visibility: isFakeArtist ? "visible" : "hidden",
      opacity: isFakeArtist ? 1 : 0,
      transition: isFakeArtist ? "opacity 2s ease-in-out" : "none",
    }}
  />
)

const Player = ({ showLoserBubble }: { showLoserBubble: boolean }) => (
  <Box
    sx={{
      position: "relative",
      width: 70,
      height: 112,
    }}
  >
    <FadeInFakeArtistLostImage isFakeArtist={showLoserBubble} />
    <PlayerImage />
  </Box>
)

const PlayerImage = () => (
  <img
    src={"./player_large.png"}
    alt="player"
    style={{
      width: "100%",
      height: "100%",
      display: "block",
    }}
  />
)

const PlayerPenColor = ({ penColor }: { penColor: string }) => (
  <Box width={"5rem"} height={"1rem"} bgcolor={penColor} />
)

const NumberOfVotesText = ({ voteCount }: { voteCount: number }) => (
  <Typography variant="h6" color={"black"}>
    {voteCount ?? 0}
  </Typography>
)

const LoserSpeechBubble = () => {
  const [loserMessage, setLoserMessage] = useState("Rats!")
  const [positionOfBubble, setPositionOfBubble] = useState({
    marginTop: "-0.5em",
    marginLeft: "5em",
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoserMessage("The title is...DOG!")
      setPositionOfBubble({ marginTop: "-0.5em", marginLeft: "11em" })
    }, 5000)

    return () => clearTimeout(timer)
  })

  return (
    <Box
      sx={{
        position: "absolute",
        zIndex: 10,
        ...positionOfBubble,
      }}
    >
      <Bubble>
        <Typography variant="body1" fontWeight={"bold"}>
          {loserMessage}
        </Typography>
      </Bubble>
    </Box>
  )
}

const PlayerBox = ({
  penColor,
  points,
  showLoserBubble,
}: {
  penColor: string
  points: number
  showLoserBubble: boolean
}) => (
  <Box display="flex" flexDirection="column" alignItems="center">
    {showLoserBubble && <LoserSpeechBubble />}
    <NumberOfVotesText voteCount={points} />
    <Player showLoserBubble={showLoserBubble} />
    <PlayerPenColor penColor={penColor} />
  </Box>
)

export default PlayerBox
