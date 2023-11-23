"use client"

import React, { useEffect, useState } from "react"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import CanvasImageDisplay from "./CanvasImageDisplay"
import PickFakeArtist from "./PickFakeArtist"
import { useUser } from "@/app/UserProvider"
import QMAndFakeArtistWinDialog from "./QMAndFakeArtistWinDialog"
import FakeArtistCaught from "./FakeArtistCaught"

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
  isFakeArtist: boolean
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
  playersWithoutQMAndFakeArtist,
  isFakeArtist,
}) => {
  if (isPickFakeArtistVisible) {
    return (
      <PickFakeArtist
        canvasWebSocket={canvasWebSocket}
        gameCode={gameCode}
        playersWithoutQuestionMaster={playersWithoutQuestionMaster}
        evaluateFakeArtistStatus={evaluateFakeArtistStatus}
        fakeArtistLost={fakeArtistLost}
        fakeArtistWon={fakeArtistWon}
        numberOfPlayersIsLargerThanMinimum={numberOfPlayersIsLargerThanMinimum}
      />
    )
  } else if (!isPickFakeArtistVisible && fakeArtistWon) {
    return (
      <QMAndFakeArtistWinDialog
        fakeArtist={fakeArtist}
        questionMaster={questionMaster}
      />
    )
  } else if (!isPickFakeArtistVisible && fakeArtistLost) {
    return (
      <FakeArtistCaught
        numberOfPlayersIsLargerThanMinimum={numberOfPlayersIsLargerThanMinimum}
        playersWithoutQMAndFakeArtist={playersWithoutQMAndFakeArtist}
        isFakeArtist={isFakeArtist}
        canvasWebSocket={canvasWebSocket}
        gameCode={gameCode}
      />
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
    username,
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
    }
  }, [fakeArtistWon])

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
          isFakeArtist={username === fakeArtist}
        />
        <Box bgcolor="white" borderRadius={2}>
          <CanvasImageDisplay imageDataUrl={imageDataUrl} />
        </Box>
      </Box>
    </Backdrop>
  )
}

export default FakeArtistAndCanvasDialog
