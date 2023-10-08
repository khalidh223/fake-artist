"use client"
import Players from "@/components/canvas/Players"
import Sketchpad from "@/components/canvas/Sketchpad"
import Box from "@mui/material/Box"
import { useEffect, useState } from "react"
import { useUser } from "../UserProvider"
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
    // Cleanup listener
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

export type PenChosenData = {
  color: string,
  username: string
}

const useAddEventListenerToPlayerSocket = (
  playerSocket: WebSocket | null,
  setRole: React.Dispatch<
    React.SetStateAction<"FAKE_ARTIST" | "PLAYER" | "QUESTION_MASTER" | null>
  >,
  setAllPlayersHaveARole: React.Dispatch<React.SetStateAction<boolean>>,
  setPenChosen: React.Dispatch<React.SetStateAction<PenChosenData | null>>,
  setAllPlayersConfirmedColor: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data)
      if (data.action === "roleForPlayer") {
        setRole(data.role)
      }

      if (data.action === "allPlayersHaveARole") {
        setAllPlayersHaveARole(true)
      }

      if (data.action === "setColorChosen") {
        let penChosenData: PenChosenData = {
          color: data.colorChosen,
          username: data.username
        }
        setPenChosen(penChosenData)
      }

      if (data.action === "allPlayersConfirmedColor") {
        setAllPlayersConfirmedColor(data.allPlayersConfirmedColor)
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
  }, [playerSocket])
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
  const { playerSocket, connectionId } = useUser()

  const [role, setRole] = useState<
    "FAKE_ARTIST" | "PLAYER" | "QUESTION_MASTER" | null
  >(null)
  const [questionMaster, setQuestionMaster] = useState<string | null>(null)
  const [allPlayersHaveARole, setAllPlayersHaveARole] = useState<boolean>(false)
  const [penChosen, setPenChosen] = useState<PenChosenData | null>(null)
  const [allPlayersConfirmedColor, setAllPlayersConfirmedColor] = useState<boolean>(false)


  useSendRoleToPlayer(canvasWebSocket, gameCode, connectionId)

  useAddEventListenerToCanvasWebSocket(canvasWebSocket, setQuestionMaster)

  useAddEventListenerToPlayerSocket(
    playerSocket,
    setRole,
    setAllPlayersHaveARole,
    setPenChosen,
    setAllPlayersConfirmedColor
  )

  useSendQuestionMaster(allPlayersHaveARole, gameCode, canvasWebSocket)

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      {role === "QUESTION_MASTER" ? <QuestionMasterDialog /> : null}
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
      <Sketchpad />
    </Box>
  )
}
