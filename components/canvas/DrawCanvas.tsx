"use client"
import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useDrawSocket } from "../../app/DrawSocketProvider"
import { Socket } from "socket.io-client"
import { useUser } from "@/app/UserProvider"

const MAX_DRAWINGS = 2

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

const DrawCanvas = ({
  canvasWebSocket,
}: {
  canvasWebSocket: WebSocket | null
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const lastCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const [color, setColor] = useState<string>("#00FF00")
  const numberOfDrawingsRef = useRef(0);
  const drawingRef = useRef<boolean>(false)
  const gameCode = useGameCode()
  const { hexCodeOfColorChosen, setCanvasDimensions, players, username } =
    useUser()

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
        players,
        sendWebSocketMessage,
        username,
        canvasWebSocket
      ),
    [color, drawCanvasSocket, gameCode]
  )

  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        canvasRef.current.width = canvasRef.current.parentElement.clientWidth
        canvasRef.current.height = canvasRef.current.parentElement.clientHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    return () => window.removeEventListener("resize", resizeCanvas)
  }, [])

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  )
}

const useGameCode = (): string => {
  const params = useSearchParams()
  return params.get("gameCode") || ""
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
    drawCanvasSocket.disconnect()
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
  players: string[] | null,
  sendWebSocketMessage: (
    socket: WebSocket | null,
    data: object
  ) => (() => void) | undefined,
  username: string,
  canvasWebSocket: WebSocket | null
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
    if (numberOfDrawingsRef.current === MAX_DRAWINGS && players != null) {
      sendWebSocketMessage(canvasWebSocket, {
        action: "sendPlayerStoppedDrawing",
        username: username,
        gameCode,
      })
      numberOfDrawingsRef.current = 0
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
  context.lineWidth = 2
  context.moveTo(prevX, prevY)
  context.lineTo(x, y)
  context.stroke()
  context.closePath()
}

export default DrawCanvas
