"use client"

import React, { useEffect, useState } from "react"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import CanvasImageDisplay from "./CanvasImageDisplay"
import PickFakeArtist from "./PickFakeArtist"
import { useUser } from "@/app/UserProvider"
import QMAndFakeArtistWinDialog from "./QMAndFakeArtistWinDialog"
import PlayersWinDialog from "./PlayersWinDialog"

interface SwitchFakeArtistDialogProps {
  isPickFakeArtistVisible: boolean
  numberOfPlayersIsLargerThanMinimum: boolean
  canvasWebSocket: WebSocket | null
  gameCode: string
  playersWithoutQuestionMaster: string[] | undefined
  evaluateFakeArtistStatus: () => void
  fakeArtistLost: boolean
  fakeArtistWon: boolean
  fakeArtist: string
  questionMaster: string
  playersWithoutQMAndFakeArtist: string[] | undefined
}

const SwitchFakeArtistDialog: React.FC<SwitchFakeArtistDialogProps> = ({
  isPickFakeArtistVisible,
  numberOfPlayersIsLargerThanMinimum,
  canvasWebSocket,
  gameCode,
  playersWithoutQuestionMaster,
  evaluateFakeArtistStatus,
  fakeArtistLost,
  fakeArtistWon,
  fakeArtist,
  questionMaster,
  playersWithoutQMAndFakeArtist
}) => {
  if (isPickFakeArtistVisible) {
    return (
      <Box
        bgcolor="white"
        borderRadius={2}
        paddingLeft={4}
        paddingRight={4}
        width={numberOfPlayersIsLargerThanMinimum ? "48em" : "40em"}
        height={numberOfPlayersIsLargerThanMinimum ? "35em" : "24em"}
      >
        <PickFakeArtist
          canvasWebSocket={canvasWebSocket}
          gameCode={gameCode}
          playersWithoutQuestionMaster={playersWithoutQuestionMaster}
          evaluateFakeArtistStatus={evaluateFakeArtistStatus}
          fakeArtistLost={fakeArtistLost}
          fakeArtistWon={fakeArtistWon}
        />
      </Box>
    )
  } else if (!isPickFakeArtistVisible && fakeArtistWon) {
    return (
      <Box
        bgcolor="white"
        borderRadius={2}
        paddingLeft={4}
        paddingRight={4}
        width={"40em"}
        height={"24em"}
      >
        <QMAndFakeArtistWinDialog
          fakeArtist={fakeArtist}
          questionMaster={questionMaster}
        />
      </Box>
    )
  } else if (!isPickFakeArtistVisible && fakeArtistLost) {
    return (
      <Box
        bgcolor="white"
        borderRadius={2}
        paddingLeft={4}
        paddingRight={4}
        width={numberOfPlayersIsLargerThanMinimum ? "48em" : "40em"}
        height={numberOfPlayersIsLargerThanMinimum ? "35em" : "24em"}
      >
        <PlayersWinDialog
          playersWithoutQMAndFakeArtist={playersWithoutQMAndFakeArtist}
        />
      </Box>
    )
  }
  return <></>
}

const FakeArtistAndCanvasDialog = ({
  canvasWebSocket,
  imageDataUrl,
  gameCode,
}: {
  canvasWebSocket: WebSocket | null
  imageDataUrl: string
  gameCode: string
}) => {
  const {
    players,
    questionMaster,
    playerToNumberOfFakeArtistVotes,
    fakeArtist,
    setPlayerToNumberOfTwoCoins,
    setPlayerToNumberOfOneCoins,
  } = useUser()

  const [isPickFakeArtistVisible, setIsPickFakeArtistVisible] = useState(true)
  const [fakeArtistLost, setFakeArtistLost] = useState<boolean>(false)
  const [fakeArtistWon, setFakeArtistWon] = useState<boolean>(false)

  const playersWithoutQuestionMaster = players?.filter(
    (player) => player != questionMaster
  )

  const playersWithoutQMAndFakeArtist = playersWithoutQuestionMaster?.filter(
    (player) => player != fakeArtist
  )

  useEffect(() => {
    if (fakeArtistLost || fakeArtistWon) {
      const timer = setTimeout(() => setIsPickFakeArtistVisible(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [fakeArtistLost, fakeArtistWon])

  useEffect(() => {
    if (fakeArtistWon && questionMaster != null) {
      setPlayerToNumberOfTwoCoins((prevPoints) => {
        const updatedPoints = { ...prevPoints }
        
        updatedPoints[fakeArtist] += 1
        updatedPoints[questionMaster] += 1

        return updatedPoints
      })
    } else if (fakeArtistLost && playersWithoutQMAndFakeArtist != undefined) {
      setPlayerToNumberOfOneCoins((prevPoints) => {
        const updatedPoints = { ...prevPoints }

        for (const player of playersWithoutQMAndFakeArtist) {
          updatedPoints[player] += 1
        }
        
        return updatedPoints
      })
    }
  }, [fakeArtistWon, fakeArtistLost])

  const evaluateFakeArtistStatus = () => {
    const isVoteMax = (vote: number, sortedVotes: number[]) =>
      vote === sortedVotes[0]
    const isVoteTied = (sortedVotes: number[]) =>
      sortedVotes[0] === sortedVotes[1]

    if (fakeArtist !== "") {
      const sortedVotes = Object.values(playerToNumberOfFakeArtistVotes).sort(
        (a, b) => b - a
      )
      const isLoser =
        isVoteMax(playerToNumberOfFakeArtistVotes[fakeArtist], sortedVotes) &&
        !isVoteTied(sortedVotes)
      const isWinner =
        !isVoteMax(playerToNumberOfFakeArtistVotes[fakeArtist], sortedVotes) ||
        isVoteTied(sortedVotes)

      setTimeout(() => {
        setFakeArtistLost(isLoser)
        setFakeArtistWon(isWinner)
      }, 2000)
    }
  }
  const numberOfPlayersIsLargerThanMinimum =
    playersWithoutQuestionMaster != undefined &&
    playersWithoutQuestionMaster.length > 4

  return (
    <Backdrop open={true} style={{ zIndex: 1300 }}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
        gap={5}
      >
        <SwitchFakeArtistDialog
          isPickFakeArtistVisible={isPickFakeArtistVisible}
          numberOfPlayersIsLargerThanMinimum={
            numberOfPlayersIsLargerThanMinimum
          }
          canvasWebSocket={canvasWebSocket}
          gameCode={gameCode}
          playersWithoutQuestionMaster={playersWithoutQuestionMaster}
          evaluateFakeArtistStatus={evaluateFakeArtistStatus}
          fakeArtistLost={fakeArtistLost}
          fakeArtistWon={fakeArtistWon}
          fakeArtist={fakeArtist}
          questionMaster={questionMaster != null ? questionMaster : ""}
          playersWithoutQMAndFakeArtist={playersWithoutQMAndFakeArtist}
        />
        <Box bgcolor="white" borderRadius={2}>
          <CanvasImageDisplay imageDataUrl={imageDataUrl} />
        </Box>
      </Box>
    </Backdrop>
  )
}

export default FakeArtistAndCanvasDialog
