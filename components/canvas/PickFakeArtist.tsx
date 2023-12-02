import React, { useEffect, useState } from "react"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import { Box, Typography } from "@mui/material"
import { useUser } from "@/app/UserProvider"
import PlayerBox from "./PlayerBox"
import { sendWebSocketMessage } from "./utils"

interface DialogTitleBoxProps {
  questionMaster: string
  username: string
  countdownMessage: string
}

const DialogTitleBox: React.FC<DialogTitleBoxProps> = ({
  questionMaster,
  username,
  countdownMessage,
}) => (
  <Box
    display="flex"
    alignItems="center"
    marginY={1}
    width="100%"
    justifyContent="space-between"
  >
    <Box display="flex" alignItems="center">
      {questionMaster !== username && (
        <img
          src="/qm_speaking.png"
          alt="question master"
          style={{
            width: 42,
            height: 66,
            backgroundColor: "transparent",
            marginRight: "0.5rem",
          }}
        />
      )}
      <Typography variant="h6" align="center">
        {countdownMessage}
      </Typography>
    </Box>
  </Box>
)

interface PlayersGridProps {
  players: string[] | undefined
  renderPlayer: (player: string, index: number) => JSX.Element
}

const PlayersGrid: React.FC<PlayersGridProps> = ({ players, renderPlayer }) => (
  <>
    <Box display="flex" justifyContent="center" alignItems="center" gap={4}>
      {players?.slice(0, 4).map(renderPlayer)}
    </Box>
    {players && players.length > 4 && (
      <Box display="flex" justifyContent="center" alignItems="center" gap={4}>
        {players?.slice(4).map(renderPlayer)}
      </Box>
    )}
  </>
)

interface PickFakeArtistProps {
  canvasWebSocket: WebSocket | null
  gameCode: string
  playersWithoutQuestionMaster: string[] | undefined
  evaluateFakeArtistStatus: () => void
  fakeArtistLost: boolean
  fakeArtistWon: boolean
  numberOfPlayersIsLargerThanMinimum: boolean
}

const PickFakeArtist: React.FC<PickFakeArtistProps> = ({
  canvasWebSocket,
  gameCode,
  playersWithoutQuestionMaster,
  evaluateFakeArtistStatus,
  fakeArtistLost,
  fakeArtistWon,
  numberOfPlayersIsLargerThanMinimum
}) => {
  const {
    playerToConfirmedHexColor,
    username,
    playerToNumberOfFakeArtistVotes,
    fakeArtist,
    questionMaster,
  } = useUser()

  const [countdownMessage, setCountdownMessage] = useState<string>(
    questionMaster !== username
      ? "On the count of three, pick the fake artist!"
      : "Players will now vote for the fake artist!"
  )
  const [countdownComplete, setCountdownComplete] = useState<boolean>(false)
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)

  useEffect(() => initializeCountdown(), [])
  useEffect(() => {
    if (fakeArtist != "") {
      evaluateFakeArtistStatus()
      setCountdownMessage("The fake artist is...")
    }
  }, [fakeArtist, playerToNumberOfFakeArtistVotes])

  const initializeCountdown = () => {
    const countdownParts = ["3,", "2,", "1,", "pick!"]
    const initialDelay = 5000
    const interval = 1000

    const timer = setTimeout(() => {
      let currentPart = 0
      const countdownTimer = setInterval(() => {
        if (currentPart < countdownParts.length) {
          setCountdownMessage(
            countdownParts.slice(0, currentPart + 1).join(" ")
          )
          currentPart++
        } else {
          clearInterval(countdownTimer)
          setCountdownComplete(true)
        }
      }, interval)
    }, initialDelay)

    return () => clearTimeout(timer)
  }

  const sendVote = (player: string) => {
    if (countdownComplete && !selectedPlayer) {
      setSelectedPlayer(player)
      sendWebSocketMessage(canvasWebSocket, {
        action: "sendVoteForFakeArtist",
        votedForPlayer: player,
        username: username,
        gameCode,
      })
    }
  }

  const isPlayerClickable = (player: string) =>
    countdownComplete &&
    !(username === player) &&
    !selectedPlayer &&
    fakeArtist === ""

  const renderPlayer = (player: string, index: number) => (
    <PlayerBox
      key={index}
      player={player}
      onHover={setHoveredPlayer}
      onLeave={() => setHoveredPlayer(null)}
      onClick={() => isPlayerClickable(player) && sendVote(player)}
      isFakeArtist={player === fakeArtist}
      fakeArtistLost={fakeArtistLost}
      fakeArtistWon={fakeArtistWon}
      voteCount={playerToNumberOfFakeArtistVotes[player] ?? 0}
      isClickable={isPlayerClickable(player)}
      selectedStyle={
        selectedPlayer === player || hoveredPlayer === player
          ? "/player_large_hovered.png"
          : "/player_large.png"
      }
      isYou={player === username}
      penColorOfPlayer={playerToConfirmedHexColor[player]}
      isQuestionMaster={questionMaster === username}
    />
  )

  return (
    <Box
      bgcolor="white"
      borderRadius={2}
      paddingLeft={4}
      paddingRight={4}
      width={numberOfPlayersIsLargerThanMinimum ? "48em" : "40em"}
      height={numberOfPlayersIsLargerThanMinimum ? "35em" : "24em"}
    >
      <DialogTitle>
        <DialogTitleBox
          questionMaster={questionMaster}
          username={username}
          countdownMessage={countdownMessage}
        />
      </DialogTitle>
      <DialogContent>
        <PlayersGrid
          players={playersWithoutQuestionMaster}
          renderPlayer={renderPlayer}
        />
      </DialogContent>
    </Box>
  )
}

export default PickFakeArtist
