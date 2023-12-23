"use client"
import Players from "@/components/canvas/Players"
import Sketchpad from "@/components/canvas/Sketchpad"
import Box from "@mui/material/Box"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import {
  PlayerToConfirmedHexColorMap,
  PlayerToNumberOfFakeArtistVotes,
  PlayerToNumberOfOneCoins,
  PlayerToNumberOfTwoCoins,
  useUser,
} from "../UserProvider"
import { useSearchParams } from "next/navigation"
import QuestionMasterDialog from "@/components/canvas/QuestionMasterDialog"
import FakeArtistDialog from "@/components/canvas/FakeArtistDialog"
import PlayerDialog from "@/components/canvas/PlayerDialog"
import FakeArtistAndCanvasDialog from "@/components/canvas/FakeArtistAndCanvasDialog"
import { sendWebSocketMessage } from "@/components/canvas/utils"
import { motion } from "framer-motion"
import LoadingNewGame from "@/components/canvas/LoadingNewGame"
import NoGameCodeErrorPage from "@/components/canvas/NoGameCodeErrorPage"
import NotMemberOfGameErrorPage from "@/components/canvas/NotMemberOfGameErrorPage"
import SomePlayerLeftGameDialog from "@/components/canvas/SomePlayerLeftGameDialog"
import HostEndedGameDialog from "@/components/canvas/HostEndedGameDialog"

const useGameCode = () => {
  const params = useSearchParams()
  return params?.get("gameCode") || ""
}

const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    const socketInstance = new WebSocket(url)
    setSocket(socketInstance)
    return () => {
      socketInstance.close()
    }
  }, [url])

  return socket
}

const useSendRoleToPlayer = (
  canvasSocket: WebSocket | null,
  gameCode: string,
  connectionId: string
) => {
  useEffect(() => {
    sendWebSocketMessage(canvasSocket, {
      action: "sendRoleToPlayers",
      gameCode,
      playerConnectionId: connectionId,
    })
  }, [canvasSocket, gameCode, connectionId])
}

export type PenChosenData = {
  color: string
  username: string
}

const useAddEventListenerToPlayerSocket = (
  resetLocalState: (
    setRole: Dispatch<
      SetStateAction<"FAKE_ARTIST" | "PLAYER" | "QUESTION_MASTER" | null>
    >,
    setPenChosen: Dispatch<SetStateAction<PenChosenData | null>>,
    setSomePlayerLeftGame: Dispatch<SetStateAction<boolean>>,
    setHostEndedGame: Dispatch<SetStateAction<boolean>>
  ) => void,
  playerSocket: WebSocket | null,
  setRole: React.Dispatch<
    React.SetStateAction<"FAKE_ARTIST" | "PLAYER" | "QUESTION_MASTER" | null>
  >,
  setPenChosen: React.Dispatch<React.SetStateAction<PenChosenData | null>>,
  setAllPlayersConfirmedColor: React.Dispatch<React.SetStateAction<boolean>>,
  setThemeChosenByQuestionMaster: React.Dispatch<React.SetStateAction<string>>,
  setTitleChosenByQuestionMaster: React.Dispatch<React.SetStateAction<string>>,
  setPlayerToConfirmedHexColor: React.Dispatch<
    React.SetStateAction<PlayerToConfirmedHexColorMap>
  >,
  setCurrentPlayerDrawing: React.Dispatch<React.SetStateAction<string>>,
  players: string[] | null,
  setPlayers: React.Dispatch<React.SetStateAction<string[] | null>>,
  questionMaster: string,
  currentPlayerDrawing: string,
  setGameEnded: React.Dispatch<React.SetStateAction<boolean>>,
  playerToNumberOfFakeArtistVotes: PlayerToNumberOfFakeArtistVotes,
  setPlayerToNumberOfFakeArtistVotes: React.Dispatch<
    React.SetStateAction<PlayerToNumberOfFakeArtistVotes>
  >,
  setFakeArtist: React.Dispatch<React.SetStateAction<string>>,
  setFakeArtistGuessAndActualTitle: Dispatch<
    SetStateAction<{
      fakeArtistGuess: string
      actualTitle: string
    }>
  >,
  setAllPlayersResettedRoundState: Dispatch<SetStateAction<boolean>>,
  setQuestionMaster: Dispatch<SetStateAction<string>>,
  allPlayersResettedRoundState: boolean,
  setSomePlayerLeftGame: Dispatch<SetStateAction<boolean>>,
  setHostEndedGame: Dispatch<SetStateAction<boolean>>
) => {
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data)
      if (data.action === "listOfPlayers") {
        setPlayers(data.players)
      } else if (data.action === "roleForPlayer") {
        setRole(data.role)
      } else if (data.action === "gameLeft") {
        setSomePlayerLeftGame(true)
      } else if (data.action === "gameEnded") {
        setHostEndedGame(true)
      } else if (data.action === "setColorChosen") {
        let penChosenData: PenChosenData = {
          color: data.colorChosen,
          username: data.username,
        }
        setPenChosen(penChosenData)
      } else if (data.action === "colorConfirmed") {
        setPlayerToConfirmedHexColor((prevColors) => {
          const updatedColors = { ...prevColors }
          updatedColors[data.username] = data.color
          return updatedColors
        })
      } else if (data.action === "allPlayersConfirmedColor") {
        setAllPlayersConfirmedColor(data.allPlayersConfirmedColor)
      } else if (data.action === "setThemeChosenByQuestionMaster") {
        setThemeChosenByQuestionMaster(data.theme)
      } else if (data.action === "setTitleChosenByQuestionMaster") {
        setTitleChosenByQuestionMaster(data.title)
      } else if (data.action === "nextPlayerToDraw") {
        setCurrentPlayerDrawing(data.next_player)
      } else if (data.action === "setStopGame") {
        setGameEnded(true)
      } else if (data.action === "votedForPlayerToBeFakeArtist") {
        setPlayerToNumberOfFakeArtistVotes((prevPlayers) => {
          const playerToVotes = { ...prevPlayers }
          if (!(data.player in playerToVotes)) {
            playerToVotes[data.player] = 1
            return playerToVotes
          }
          playerToVotes[data.player] += 1
          return playerToVotes
        })
      } else if (data.action === "setFakeArtist") {
        setFakeArtist(data.fakeArtist)
      } else if (data.action === "setFakeArtistGuessAndActualTitle") {
        setFakeArtistGuessAndActualTitle({
          fakeArtistGuess: data.titleGuessedByFakeArtist,
          actualTitle: data.actualTitle,
        })
      } else if (data.action === "allPlayersResettedRoundState") {
        resetLocalState(
          setRole,
          setPenChosen,
          setSomePlayerLeftGame,
          setHostEndedGame
        )
        setAllPlayersResettedRoundState(true)
      } else if (data.action === "getUsernameOfQuestionMaster") {
        setQuestionMaster(data.username)
      }
    }

    if (playerSocket) {
      playerSocket.addEventListener("message", onMessage)
    }

    return () => {
      if (playerSocket) {
        playerSocket.removeEventListener("message", onMessage)
      }
    }
  }, [
    playerSocket,
    players,
    questionMaster,
    currentPlayerDrawing,
    allPlayersResettedRoundState,
  ])
}

const useSetAllPlayersInitialPoints = (
  players: string[] | null,
  setPlayerToNumberOfTwoCoins: Dispatch<
    SetStateAction<PlayerToNumberOfTwoCoins>
  >,
  setPlayerToNumberOfOneCoins: Dispatch<
    SetStateAction<PlayerToNumberOfOneCoins>
  >,
  playerToNumberOfOneCoins: PlayerToNumberOfOneCoins,
  playerToNumberOfTwoCoins: PlayerToNumberOfTwoCoins
) => {
  useEffect(() => {
    if (
      players != null &&
      (Object.values(playerToNumberOfOneCoins).some((value) => value === 1) ||
        Object.values(playerToNumberOfTwoCoins).some((value) => value === 1))
    ) {
      setPlayerToNumberOfOneCoins(playerToNumberOfOneCoins)
      setPlayerToNumberOfTwoCoins(playerToNumberOfTwoCoins)
      return
    }

    if (players != null) {
      setPlayerToNumberOfTwoCoins((prevPlayers) => {
        const updatedPlayers = { ...prevPlayers }

        for (const player of players) {
          updatedPlayers[player] = 0
        }

        return updatedPlayers
      })

      setPlayerToNumberOfOneCoins((prevPlayers) => {
        const updatedPlayers = { ...prevPlayers }

        for (const player of players) {
          updatedPlayers[player] = 0
        }

        return updatedPlayers
      })
    }
  }, [players])
}

export default function Home() {
  const websocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT
  if (!websocketURL) {
    throw "WebSocket URL was not defined in this environment"
  }

  const gameCode = useGameCode()
  const canvasWebSocket = useWebSocket(websocketURL)
  const {
    playerSocket,
    connectionId,
    setThemeChosenByQuestionMaster,
    setTitleChosenByQuestionMaster,
    questionMaster,
    setQuestionMaster,
    setPlayerToConfirmedHexColor,
    setCurrentPlayerDrawing,
    players,
    setPlayers,
    currentPlayerDrawing,
    allPlayersConfirmedColor,
    setAllPlayersConfirmedColor,
    exittedTitleCard,
    titleChosenByQuestionMaster,
    themeChosenByQuestionMaster,
    setGameEnded,
    gameEnded,
    canvasBitmapAtEndOfGame,
    playerToNumberOfFakeArtistVotes,
    setPlayerToNumberOfFakeArtistVotes,
    setFakeArtist,
    setPlayerToNumberOfTwoCoins,
    setPlayerToNumberOfOneCoins,
    setFakeArtistGuessAndActualTitle,
    setAllPlayersResettedRoundState,
    setHexCodeOfColorChosen,
    setCloseSlidingImage,
    setShowQMChip,
    setExittedTitleCard,
    setCanvasBitmapAtEndOfGame,
    allPlayersResettedRoundState,
    setRole,
    role,
    playerToNumberOfOneCoins,
    playerToNumberOfTwoCoins,
    username,
  } = useUser()

  const pageVariants = role
    ? {
        initial: { opacity: 0, transition: { duration: 0.5 } },
        animate: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, transition: { duration: 0.5 } },
      }
    : {
        initial: {},
        animate: {},
        exit: {},
      }

  const pageTransition = { duration: 0.5 }

  const [penChosen, setPenChosen] = useState<PenChosenData | null>(null)
  const [somePlayerLeftGame, setSomePlayerLeftGame] = useState(false)
  const [hostEndedGame, setHostEndedGame] = useState(false)

  const resetLocalState = (
    setRole: Dispatch<
      SetStateAction<"FAKE_ARTIST" | "PLAYER" | "QUESTION_MASTER" | null>
    >,
    setPenChosen: Dispatch<SetStateAction<PenChosenData | null>>,
    setSomePlayerLeftGame: Dispatch<SetStateAction<boolean>>,
    setHostEndedGame: Dispatch<SetStateAction<boolean>>
  ) => {
    setRole(null)
    setHexCodeOfColorChosen(null)
    setQuestionMaster("")
    setCloseSlidingImage(false)
    setShowQMChip(false)
    setPenChosen(null)
    setExittedTitleCard(false)
    setCanvasBitmapAtEndOfGame("")
    setPlayerToConfirmedHexColor({})
    setAllPlayersConfirmedColor(false)
    setThemeChosenByQuestionMaster("")
    setTitleChosenByQuestionMaster("")
    setCurrentPlayerDrawing("")
    setGameEnded(false)
    setPlayerToNumberOfFakeArtistVotes({})
    setFakeArtist("")
    setFakeArtistGuessAndActualTitle({
      fakeArtistGuess: "",
      actualTitle: "",
    })
    setSomePlayerLeftGame(false)
    setHostEndedGame(false)
  }

  useSetAllPlayersInitialPoints(
    players,
    setPlayerToNumberOfTwoCoins,
    setPlayerToNumberOfOneCoins,
    playerToNumberOfOneCoins,
    playerToNumberOfTwoCoins
  )

  useSendRoleToPlayer(canvasWebSocket, gameCode, connectionId)

  useAddEventListenerToPlayerSocket(
    resetLocalState,
    playerSocket,
    setRole,
    setPenChosen,
    setAllPlayersConfirmedColor,
    setThemeChosenByQuestionMaster,
    setTitleChosenByQuestionMaster,
    setPlayerToConfirmedHexColor,
    setCurrentPlayerDrawing,
    players,
    setPlayers,
    questionMaster,
    currentPlayerDrawing,
    setGameEnded,
    playerToNumberOfFakeArtistVotes,
    setPlayerToNumberOfFakeArtistVotes,
    setFakeArtist,
    setFakeArtistGuessAndActualTitle,
    setAllPlayersResettedRoundState,
    setQuestionMaster,
    allPlayersResettedRoundState,
    setSomePlayerLeftGame,
    setHostEndedGame
  )

  useEffect(() => {
    if (role != null) {
      setAllPlayersResettedRoundState(false)
    }
  }, [role, allPlayersResettedRoundState])

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.returnValue = ""
    sendWebSocketMessage(playerSocket, {
      action: "leaveGame",
      gameCode: gameCode,
      username: username,
    })
    playerSocket?.close()
  }

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  if (gameCode === "") {
    return <NoGameCodeErrorPage />
  }

  if (gameCode !== "" && username === "") {
    return <NotMemberOfGameErrorPage />
  }

  if (somePlayerLeftGame) {
    return (
      <SomePlayerLeftGameDialog
        playerSocket={playerSocket}
        setSomePlayerLeftGame={setSomePlayerLeftGame}
      />
    )
  }

  if (hostEndedGame) {
    return (
      <HostEndedGameDialog
        playerSocket={playerSocket}
        setHostEndedGame={setHostEndedGame}
      />
    )
  }

  if (!role) {
    return <LoadingNewGame />
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        {role === "QUESTION_MASTER" ? (
          <QuestionMasterDialog
            gameCode={gameCode}
            allPlayersConfirmedColor={allPlayersConfirmedColor}
          />
        ) : null}
        {role === "FAKE_ARTIST" ? (
          <FakeArtistDialog
            penChosen={penChosen}
            canvasWebSocket={canvasWebSocket}
            gameCode={gameCode}
            allPlayersConfirmedColor={allPlayersConfirmedColor}
          />
        ) : null}
        {role === "PLAYER" ? (
          <PlayerDialog
            penChosen={penChosen}
            canvasWebSocket={canvasWebSocket}
            gameCode={gameCode}
            allPlayersConfirmedColor={allPlayersConfirmedColor}
          />
        ) : null}
        <Players
          socket={playerSocket}
          gameCode={gameCode}
          questionMaster={questionMaster}
        />
        <Sketchpad
          canvasWebSocket={canvasWebSocket}
          title={titleChosenByQuestionMaster}
          theme={themeChosenByQuestionMaster}
          exittedTitleCard={exittedTitleCard}
          allPlayersResettedRoundState={allPlayersResettedRoundState}
        />
        {gameEnded ? (
          <FakeArtistAndCanvasDialog
            canvasWebSocket={canvasWebSocket}
            imageDataUrl={canvasBitmapAtEndOfGame}
            gameCode={gameCode}
          />
        ) : null}
      </Box>
    </motion.div>
  )
}