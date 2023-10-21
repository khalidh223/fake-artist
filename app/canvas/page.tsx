"use client"
import Players from "@/components/canvas/Players"
import Sketchpad from "@/components/canvas/Sketchpad"
import Box from "@mui/material/Box"
import { useEffect, useState } from "react"
import { PlayerToConfirmedHexColorMap, useUser } from "../UserProvider"
import { useSearchParams } from "next/navigation"
import QuestionMasterDialog from "@/components/canvas/QuestionMasterDialog"
import FakeArtistDialog from "@/components/canvas/FakeArtistDialog"
import PlayerDialog from "@/components/canvas/PlayerDialog"

const useGameCode = () => {
  const params = useSearchParams()
  return params.get("gameCode") || ""
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

const useAddEventListenerToCanvasWebSocket = (
  canvasSocket: WebSocket | null,
  setQuestionMaster: React.Dispatch<React.SetStateAction<string | null>>
) => {
  useEffect(() => {
    const messageEventListener = (event: MessageEvent) => {
      const data = JSON.parse(event.data)
      if (data.action === "getUsernameOfQuestionMaster") {
        setQuestionMaster(data.username)
      }
    }

    if (canvasSocket) {
      canvasSocket.addEventListener("message", messageEventListener)
    }

    return () => {
      if (canvasSocket) {
        canvasSocket.removeEventListener("message", messageEventListener)
      }
    }
  }, [canvasSocket])
}

function getNextElement<T>(array: T[], currentElement: T): T | null {
  const currentIndex = array.indexOf(currentElement)

  if (currentIndex === -1) {
    return null
  }

  const nextIndex = (currentIndex + 1) % array.length

  return array[nextIndex]
}

export type PenChosenData = {
  color: string
  username: string
}

const useAddEventListenerToPlayerSocket = (
  playerSocket: WebSocket | null,
  setRole: React.Dispatch<
    React.SetStateAction<"FAKE_ARTIST" | "PLAYER" | "QUESTION_MASTER" | null>
  >,
  setAllPlayersHaveARole: React.Dispatch<React.SetStateAction<boolean>>,
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
  questionMaster: string | null,
  currentPlayerDrawing: string
) => {
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data)
      if (data.action === "listOfPlayers") {
        setPlayers(data.players)
      } else if (data.action === "roleForPlayer") {
        setRole(data.role)
      } else if (data.action === "allPlayersHaveARole") {
        setAllPlayersHaveARole(true)
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
      } else if (data.action === "setPlayerStoppedDrawing") {
        if (players != null) {
          const sortedPlayers = players
            .sort()
            .filter((player) => player != questionMaster)

          setCurrentPlayerDrawing(
            getNextElement(sortedPlayers, data.player) ?? ""
          )
        }
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
  }, [playerSocket, players, questionMaster, currentPlayerDrawing])
}

const useSendQuestionMaster = (
  allPlayersHaveARole: boolean,
  gameCode: string,
  canvasSocket: WebSocket | null
) => {
  useEffect(() => {
    if (allPlayersHaveARole) {
      sendWebSocketMessage(canvasSocket, {
        action: "sendQuestionMaster",
        gameCode,
      })
    }
  }, [allPlayersHaveARole, canvasSocket, gameCode])
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
  } = useUser()

  const [role, setRole] = useState<
    "FAKE_ARTIST" | "PLAYER" | "QUESTION_MASTER" | null
  >(null)
  const [allPlayersHaveARole, setAllPlayersHaveARole] = useState<boolean>(false)
  const [penChosen, setPenChosen] = useState<PenChosenData | null>(null)

  useSendRoleToPlayer(canvasWebSocket, gameCode, connectionId)

  useAddEventListenerToCanvasWebSocket(canvasWebSocket, setQuestionMaster)

  useAddEventListenerToPlayerSocket(
    playerSocket,
    setRole,
    setAllPlayersHaveARole,
    setPenChosen,
    setAllPlayersConfirmedColor,
    setThemeChosenByQuestionMaster,
    setTitleChosenByQuestionMaster,
    setPlayerToConfirmedHexColor,
    setCurrentPlayerDrawing,
    players,
    setPlayers,
    questionMaster,
    currentPlayerDrawing
  )

  useSendQuestionMaster(allPlayersHaveARole, gameCode, canvasWebSocket)

  return (
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
      />
    </Box>
  )
}
