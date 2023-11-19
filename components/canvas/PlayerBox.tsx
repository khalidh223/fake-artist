"use client"

import { Box, Typography } from "@mui/material"
import React from "react"
import Bubble from "./Bubble"

const LoserSpeechBubble = () => (
  <Box
    sx={{
      position: "absolute",
      marginTop: "-0.5em",
      marginLeft: "5em",
      zIndex: 10,
    }}
  >
    <Bubble>
      <Typography variant="body1" fontWeight={"bold"}>
        Rats!
      </Typography>
    </Bubble>
  </Box>
)

const WinnerSpeechBubble = () => (
  <Box
    sx={{
      position: "absolute",
      marginTop: "-0.5em",
      marginLeft: "9em",
      zIndex: 10,
    }}
  >
    <Bubble>
      <Typography variant="body1" fontWeight={"bold"}>
        Better luck next time!
      </Typography>
    </Bubble>
  </Box>
)

const NumberOfVotesText = ({ voteCount }: { voteCount: number }) => (
  <Typography variant="h6">{voteCount ?? 0}</Typography>
)

interface PlayerProps {
  onClick: () => void
  isFakeArtist: boolean
  isFakeArtistLost: boolean
  isFakeArtistWon: boolean
  isClickable: boolean
  selectedStyle: string
  isQuestionMaster: boolean
}

const Player: React.FC<PlayerProps> = ({
  isClickable,
  isQuestionMaster,
  isFakeArtist,
  isFakeArtistLost,
  isFakeArtistWon,
  selectedStyle,
  onClick,
}) => (
  <Box
    sx={{
      position: "relative",
      width: 70,
      height: 112,
      cursor: isClickable && !isQuestionMaster ? "pointer" : "not-allowed",
    }}
  >
    <FadeInFakeArtistLostImage
      isFakeArtist={isFakeArtist}
      isFakeArtistLost={isFakeArtistLost}
    />
    <FadeInFakeArtistWonImage
      isFakeArtist={isFakeArtist}
      isFakeArtistWon={isFakeArtistWon}
    />
    <PlayerImage
      selectedStyle={selectedStyle}
      isQuestionMaster={isQuestionMaster}
      onClick={onClick}
    />
  </Box>
)

const FadeInFakeArtistLostImage = ({
  isFakeArtist,
  isFakeArtistLost,
}: {
  isFakeArtist: boolean
  isFakeArtistLost: boolean
}) => (
  <img
    src="/fake_artist_lost.png"
    alt="fake artist lost"
    style={{
      width: "100%",
      height: "100%",
      position: "absolute",
      visibility: isFakeArtist && isFakeArtistLost ? "visible" : "hidden",
      opacity: isFakeArtist && isFakeArtistLost ? 1 : 0,
      transition:
        isFakeArtist && isFakeArtistLost ? "opacity 2s ease-in-out" : "none",
    }}
  />
)

const FadeInFakeArtistWonImage = ({
  isFakeArtist,
  isFakeArtistWon,
}: {
  isFakeArtist: boolean
  isFakeArtistWon: boolean
}) => (
  <img
    src="/fake_artist_speaking.png"
    alt="fake artist won"
    style={{
      width: "100%",
      height: "100%",
      position: "absolute",
      visibility: isFakeArtist && isFakeArtistWon ? "visible" : "hidden",
      opacity: isFakeArtist && isFakeArtistWon ? 1 : 0,
      transition:
        isFakeArtist && isFakeArtistWon ? "opacity 2s ease-in-out" : "none",
    }}
  />
)

const PlayerImage = ({
  selectedStyle,
  isQuestionMaster,
  onClick,
}: {
  selectedStyle: string
  isQuestionMaster: boolean
  onClick: () => void
}) => (
  <img
    src={selectedStyle}
    alt="player"
    style={{
      width: "100%",
      height: "100%",
      display: "block",
    }}
    onClick={() => !isQuestionMaster && onClick()}
  />
)

const PlayerName = ({ player, isYou }: { player: string; isYou: boolean }) => (
  <Typography variant="h6">{isYou ? "You" : player}</Typography>
)

const PlayerPenColor = ({ penColor }: { penColor: string }) => (
  <Box width={"5rem"} height={"1rem"} bgcolor={penColor} />
)

interface PlayerBoxProps {
  player: string
  onHover: (player: string) => void
  onLeave: () => void
  onClick: () => void
  isFakeArtist: boolean
  isFakeArtistLost: boolean
  isFakeArtistWon: boolean
  voteCount: number
  isClickable: boolean
  selectedStyle: string
  isYou: boolean
  penColorOfPlayer: string
  isQuestionMaster: boolean
}

const PlayerBox: React.FC<PlayerBoxProps> = ({
  player,
  onHover,
  onLeave,
  onClick,
  isFakeArtist,
  isFakeArtistLost,
  isFakeArtistWon,
  voteCount,
  isClickable,
  selectedStyle,
  isYou,
  penColorOfPlayer,
  isQuestionMaster,
}) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    onMouseEnter={() => !isQuestionMaster && onHover(player)}
    onMouseLeave={() => onLeave()}
  >
    {isFakeArtist && isFakeArtistLost && <LoserSpeechBubble />}
    {isFakeArtist && isFakeArtistWon && <WinnerSpeechBubble />}
    <NumberOfVotesText voteCount={voteCount} />
    <Player
      isClickable={isClickable}
      isQuestionMaster={isQuestionMaster}
      isFakeArtist={isFakeArtist}
      onClick={onClick}
      isFakeArtistLost={isFakeArtistLost}
      isFakeArtistWon={isFakeArtistWon}
      selectedStyle={selectedStyle}
    />
    <PlayerName player={player} isYou={isYou} />
    <PlayerPenColor penColor={penColorOfPlayer} />
  </Box>
)

export default PlayerBox
