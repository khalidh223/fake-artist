"use client"
import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSocket } from "./SocketProvider"

const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const lastCoords = useRef({ x: 0, y: 0 })
  const [color, setColor] = useState("#00FF00") // Setting the color to green
  const drawingRef = useRef(false)
  const params = useSearchParams()
  const gameCode = params.get("gameCode") || ""
  const drawCanvasSocket = useSocket()

  useEffect(() => {
    console.log("Setting up drawingData listener for gameCode:", gameCode)
    if (!drawCanvasSocket) return

    drawCanvasSocket.on("error", (error) => {
      console.log("Socket error:", error)
    })

    drawCanvasSocket.on("drawingData", (data, callback) => {
      console.log("Inside drawingData listener in DrawCanvas:", data)
      const { x, y, prevX, prevY, color } = data
      draw(x, y, prevX, prevY, color)
      if (typeof callback === "function") {
        callback("Acknowledgment from client")
      }
    })

    // Cleanup
    return () => {
      console.log("Cleaning up drawingData listener for gameCode:", gameCode)
      drawCanvasSocket.off("drawingData")
      drawCanvasSocket.disconnect()
    }
  }, [gameCode, drawCanvasSocket])

  const draw = (
    x: number,
    y: number,
    prevX: number,
    prevY: number,
    color: string
  ) => {
    console.log("Drawing on canvas with coords:", x, y, prevX, prevY)
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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.addEventListener("mousedown", (e) => {
      drawingRef.current = true
      lastCoords.current = { x: e.offsetX, y: e.offsetY }
    })

    canvas.addEventListener("mouseup", () => {
      drawingRef.current = false
    })

    canvas.addEventListener("mouseout", () => {
      drawingRef.current = false
    })

    canvas.addEventListener("mousemove", (e) => {
      if (!drawingRef.current) return
      draw(
        e.offsetX,
        e.offsetY,
        lastCoords.current.x,
        lastCoords.current.y,
        color
      )

      console.log("Emitting drawing data:", {
        x: e.offsetX,
        y: e.offsetY,
        prevX: lastCoords.current.x,
        prevY: lastCoords.current.y,
        color,
        gameCode,
      })

      drawCanvasSocket?.emit(
        "drawingData",
        {
          x: e.offsetX,
          y: e.offsetY,
          prevX: lastCoords.current.x,
          prevY: lastCoords.current.y,
          color,
          gameCode,
        },
        (conf: any) => console.log("conf here: ", conf)
      )

      lastCoords.current = { x: e.offsetX, y: e.offsetY }
    })
  }, [color, drawCanvasSocket])

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default DrawingCanvas
