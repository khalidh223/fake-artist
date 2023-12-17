"use client"
import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useDrawSocket } from "../../app/DrawSocketProvider"
import { Socket } from "socket.io-client"
import { useUser } from "@/app/UserProvider"
import { sendWebSocketMessage } from "./utils"

const MAX_DRAWINGS = 2
const MAX_ROUNDS = 2

const DrawCanvas = ({
  canvasWebSocket,
  youAreCurrentlyDrawing,
  questionMaster,
  allPlayersResettedRoundState,
}: {
  canvasWebSocket: WebSocket | null
  youAreCurrentlyDrawing: boolean
  questionMaster: string
  allPlayersResettedRoundState: boolean
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const lastCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const [color, setColor] = useState<string>("#00FF00")
  const numberOfDrawingsRef = useRef(0)
  const currentRoundRef = useRef(0)
  const drawingRef = useRef<boolean>(false)
  const gameCode = useGameCode()
  const {
    hexCodeOfColorChosen,
    setCanvasDimensions,
    players,
    username,
    gameEnded,
    setCanvasBitmapAtEndOfGame,
    setAllPlayersResettedRoundState
  } = useUser()

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = 614
      canvasRef.current.height = 800
    }
  }, [])

  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      setCanvasDimensions({ width: rect.width, height: rect.height })
    }
  }, [])

  useEffect(() => {
    if (hexCodeOfColorChosen != null) {
      setColor(hexCodeOfColorChosen)
    }
  }, [hexCodeOfColorChosen])

  useEffect(() => {
    if (gameEnded) {
      if (canvasRef.current) {
        const imageDataUrl = canvasRef.current.toDataURL("image/png")
        setCanvasBitmapAtEndOfGame(imageDataUrl)
      }
    }
  }, [gameEnded])

  useEffect(() => {
    if (allPlayersResettedRoundState) {
      if (canvasRef.current) {
        const context = canvasRef.current.getContext("2d")
        context?.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        )
      }
      lastCoords.current = { x: 0, y: 0 }
      numberOfDrawingsRef.current = 0
      currentRoundRef.current = 0
      drawingRef.current = false
      setColor("")
      setAllPlayersResettedRoundState(false)
    }
  }, [allPlayersResettedRoundState])

  const drawCanvasSocket = useDrawSocket()

  useEffect(
    () => setupSocketListeners(drawCanvasSocket, canvasRef),
    [gameCode, drawCanvasSocket]
  )
  useEffect(
    () =>
      setupCanvasListeners(
        canvasRef,
        color,
        drawCanvasSocket,
        gameCode,
        drawingRef,
        lastCoords,
        numberOfDrawingsRef,
        currentRoundRef,
        players,
        sendWebSocketMessage,
        username,
        canvasWebSocket,
        youAreCurrentlyDrawing,
        questionMaster
      ),
    [color, drawCanvasSocket, gameCode]
  )

  return (
    <div style={{ width: "614px", height: "800px" }}>
      <canvas ref={canvasRef} />
    </div>
  )
}

const useGameCode = (): string => {
  const params = useSearchParams()
  return params?.get("gameCode") || ""
}

const setupSocketListeners = (
  drawCanvasSocket: Socket | null,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  if (!drawCanvasSocket) return

  drawCanvasSocket.on("error", (error: string) =>
    console.error(
      "An error occurred with the websocket for the canvas: ",
      error
    )
  )
  drawCanvasSocket.on("drawingData", (data: DrawingData) => {
    const { x, y, prevX, prevY, color } = data
    draw(x, y, prevX, prevY, color, canvasRef)
  })

  return () => {
    drawCanvasSocket.off("drawingData")
  }
}

const setupCanvasListeners = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  color: string,
  socket: Socket | null,
  gameCode: string,
  drawingRef: React.MutableRefObject<boolean>,
  lastCoords: React.MutableRefObject<{ x: number; y: number } | null>,
  numberOfDrawingsRef: React.MutableRefObject<number>,
  currentRoundRef: React.MutableRefObject<number>,
  players: string[] | null,
  sendWebSocketMessage: (
    socket: WebSocket | null,
    data: object
  ) => (() => void) | undefined,
  username: string,
  canvasWebSocket: WebSocket | null,
  youAreCurrentlyDrawing: boolean,
  questionMaster: string
) => {
  const canvas = canvasRef.current
  if (!canvas) return

  const onMouseDown = (event: MouseEvent) => {
    numberOfDrawingsRef.current += 1
    if (drawingRef.current !== undefined) drawingRef.current = true
    if (lastCoords.current)
      lastCoords.current = { x: event.offsetX, y: event.offsetY }
  }

  const stopDrawing = () => {
    const isLastSortedPlayer =
      players?.sort().filter((player) => player != questionMaster)[
        players.length - 2
      ] === username && youAreCurrentlyDrawing

    if (
      numberOfDrawingsRef.current === MAX_DRAWINGS - 1 &&
      currentRoundRef.current === MAX_ROUNDS - 1 &&
      isLastSortedPlayer
    ) {
      sendWebSocketMessage(canvasWebSocket, {
        action: "sendStopGame",
        gameCode,
      })
      currentRoundRef.current = 0
    }

    if (
      numberOfDrawingsRef.current === MAX_DRAWINGS &&
      currentRoundRef.current !== MAX_ROUNDS &&
      players != null
    ) {
      sendWebSocketMessage(canvasWebSocket, {
        action: "sendPlayerStoppedDrawing",
        username: username,
        gameCode,
      })
      numberOfDrawingsRef.current = 0
      currentRoundRef.current += 1
    }

    drawingRef.current = false
  }

  const onMouseMove = (event: MouseEvent) => {
    if (!drawingRef.current || !lastCoords.current) return

    draw(
      event.offsetX,
      event.offsetY,
      lastCoords.current.x,
      lastCoords.current.y,
      color,
      canvasRef
    )

    socket?.emit("drawingData", {
      x: event.offsetX,
      y: event.offsetY,
      prevX: lastCoords.current.x,
      prevY: lastCoords.current.y,
      color,
      gameCode,
    })

    lastCoords.current = { x: event.offsetX, y: event.offsetY }
  }

  canvas.addEventListener("mousedown", onMouseDown)
  canvas.addEventListener("mouseup", stopDrawing)
  canvas.addEventListener("mousemove", onMouseMove)

  return () => {
    if (canvas) {
      canvas.removeEventListener("mousedown", onMouseDown)
      canvas.removeEventListener("mouseup", stopDrawing)
      canvas.removeEventListener("mousemove", onMouseMove)
    }
  }
}

type DrawingData = {
  x: number
  y: number
  prevX: number
  prevY: number
  color: string
}

const draw = (
  x: number,
  y: number,
  prevX: number,
  prevY: number,
  color: string,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const context = canvasRef.current?.getContext("2d")
  if (!context) return

  context.beginPath()
  context.strokeStyle = color
  context.lineWidth = 4
  context.moveTo(prevX, prevY)
  context.lineTo(x, y)
  context.stroke()
  context.closePath()
}

export default DrawCanvas
