"use client"

import React, { useEffect, useState } from "react"
import { Box } from "@mui/material"
import PlayersWinDialog from "./PlayersWinDialog"
import YouWereCaughtDialog from "./YouWereCaughtDialog"
import FakeArtistAnimation from "./FakeArtistAnimation"
import QMAndFakeArtistWinDialog from "./QMAndFakeArtistWinDialog"
import { useUser } from "@/app/UserProvider"

interface FakeArtistCaughtProps {
  numberOfPlayersIsLargerThanMinimum: boolean
  playersWithoutQMAndFakeArtist: string[] | undefined
  isFakeArtist: boolean
  canvasWebSocket: WebSocket | null
  gameCode: string
}

const FakeArtistCaught = ({
  numberOfPlayersIsLargerThanMinimum,
  playersWithoutQMAndFakeArtist,
  isFakeArtist,
  canvasWebSocket,
  gameCode,
}: FakeArtistCaughtProps) => {
  const {
    fakeArtistGuessAndActualTitle,
    setPlayerToNumberOfOneCoins,
    questionMaster,
    setPlayerToNumberOfTwoCoins,
    fakeArtist,
  } = useUser()

  const [fakeArtistGuessedWrong, setFakeArtistGuessedWrong] = useState(false)
  const [fakeArtistGuessedRight, setFakeArtistGuessedRight] = useState(false)
  const [canShowPlayersWinDialog, setCanShowPlayersWinDialog] = useState(false)
  const [canShowFakeArtistAndQMWinDialog, setCanShowFakeArtistAndQMWinDialog] =
    useState(false)

  const { fakeArtistGuess, actualTitle } = fakeArtistGuessAndActualTitle

  useEffect(() => {
    updateGameStateBasedOnGuess()
  }, [fakeArtistGuess])

  useEffect(() => {
    showWinningDialogBasedOnGuess()
  }, [fakeArtistGuess])

  function updateGameStateBasedOnGuess() {
    const guessIsCorrect = fakeArtistGuess === actualTitle
    const guessIsNotEmpty = fakeArtistGuess !== "" && actualTitle !== ""

    if (guessIsNotEmpty) {
      setFakeArtistGuessedRight(guessIsCorrect)
      setFakeArtistGuessedWrong(!guessIsCorrect)
      updatePlayerCoins(guessIsCorrect)
    }
  }

  function updatePlayerCoins(guessIsCorrect: boolean) {
    if (guessIsCorrect) {
      updateCoinsForFakeArtistAndQM()
    } else {
      updateCoinsForPlayers()
    }
  }

  function updateCoinsForFakeArtistAndQM() {
    if (questionMaster != null) {
      setPlayerToNumberOfTwoCoins((prevPoints) => ({
        ...prevPoints,
        [fakeArtist]: prevPoints[fakeArtist] + 1,
        [questionMaster]: prevPoints[questionMaster] + 1,
      }))
    }
  }

  function updateCoinsForPlayers() {
    if (playersWithoutQMAndFakeArtist != undefined) {
      setPlayerToNumberOfOneCoins((prevPoints) => {
        const updatedPoints = { ...prevPoints }
        playersWithoutQMAndFakeArtist.forEach((player) => {
          updatedPoints[player] += 1
        })
        return updatedPoints
      })
    }
  }

  function showWinningDialogBasedOnGuess() {
    const shouldShowDialog = fakeArtistGuess !== "" && actualTitle !== ""
    if (shouldShowDialog) {
      const dialogToShow =
        fakeArtistGuess === actualTitle
          ? setCanShowFakeArtistAndQMWinDialog
          : setCanShowPlayersWinDialog
      const timer = setTimeout(() => dialogToShow(true), 5000)
      return () => clearTimeout(timer)
    }
  }

  if (isFakeArtist && fakeArtistGuess === "") {
    return (
      <YouWereCaughtDialog
        canvasWebSocket={canvasWebSocket}
        gameCode={gameCode}
      />
    )
  }

  if (!canShowPlayersWinDialog && !canShowFakeArtistAndQMWinDialog) {
    return (
      <FakeArtistAnimation
        fakeArtistGuess={fakeArtistGuess}
        fakeArtistGuessedRight={fakeArtistGuessedRight}
        fakeArtistGuessedWrong={fakeArtistGuessedWrong}
      />
    )
  }

  return (
    <Box
      bgcolor="white"
      borderRadius={2}
      paddingLeft={4}
      paddingRight={4}
      width={numberOfPlayersIsLargerThanMinimum ? "48em" : "40em"}
      height={numberOfPlayersIsLargerThanMinimum ? "35em" : "24em"}
    >
      {canShowPlayersWinDialog ? (
        <PlayersWinDialog
          playersWithoutQMAndFakeArtist={playersWithoutQMAndFakeArtist}
        />
      ) : (
        <QMAndFakeArtistWinDialog
          fakeArtist={fakeArtist}
          questionMaster={questionMaster ?? ""}
        />
      )}
    </Box>
  )
}

export default FakeArtistCaught
