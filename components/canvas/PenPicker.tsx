"use client"

import { useUser } from "@/app/UserProvider"
import { PenChosenData } from "@/app/canvas/page"
import { Box, Tooltip } from "@mui/material"
import { useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { sendWebSocketMessage } from "./utils"

const colors = [
  { penColor: "black", hex: "#000000" },
  { penColor: "brown", hex: "#954A13" },
  { penColor: "darkblue", hex: "#005AA7" },
  { penColor: "darkpink", hex: "#BE228B" },
  { penColor: "green", hex: "#006F66" },
  { penColor: "lightblue", hex: "#00AEEB" },
  { penColor: "lightgreen", hex: "#76CAA1" },
  { penColor: "orange", hex: "#FF8335" },
  { penColor: "pink", hex: "#FB108B" },
  { penColor: "purple", hex: "#4F4E9D" },
  { penColor: "red", hex: "#FC212E" },
  { penColor: "yellow", hex: "#FFF144" },
]

type ColorPlayerMap = {
  [color: string]: string
}

const PenPicker = ({
  penChosen,
  canvasWebSocket,
}: {
  penChosen: PenChosenData | null
  canvasWebSocket: WebSocket | null
}) => {
  const gameCode = useGameCode()
  const { connectionId, username, setHexCodeOfColorChosen } = useUser()
  const [selectedColor, setSelectedColor] = useState("")
  const [playersSelectedColors, setPlayersSelectedColor] =
    useState<ColorPlayerMap>({})

  useEffect(() => updatePlayersSelectedColors(penChosen), [penChosen])

  const handleColorClick = (color: string) => {
    if (isColorUnavailable(color)) return

    setSelectedColor(color)
    const hexCode = getHexCodeForColor(color)
    setHexCodeOfColorChosen(hexCode)
    sendWebSocketMessage(canvasWebSocket, {
      action: "sendColorChosen",
      colorChosen: color,
      gameCode,
      connectionId,
      username,
    })
  }

  const updatePlayersSelectedColors = (penChosen: PenChosenData | null) => {
    if (!penChosen) return

    setPlayersSelectedColor((prevColors) => {
      const updatedColors = { ...prevColors }
      Object.keys(updatedColors).forEach((color) => {
        if (updatedColors[color] === penChosen.username) {
          delete updatedColors[color]
        }
      })
      updatedColors[penChosen.color] = penChosen.username
      return updatedColors
    })
  }

  const isColorUnavailable = (color: string) => {
    return playersSelectedColors[color] || selectedColor === color
  }

  const getHexCodeForColor = (color: string) => {
    return colors.find((item) => item.penColor === color)?.hex || null
  }

  return (
    <Box display="flex" justifyContent="center" mt={2}>
      {colors.map(({ penColor }) => (
        <ColorBox
          key={penColor}
          color={penColor}
          selectedColor={selectedColor}
          playersSelectedColors={playersSelectedColors}
          onColorClick={handleColorClick}
        />
      ))}
    </Box>
  )
}

interface ColorBoxProps {
  color: string
  selectedColor: string
  playersSelectedColors: ColorPlayerMap
  onColorClick: (color: string) => void
}

const ColorBox: React.FC<ColorBoxProps> = ({
  color,
  selectedColor,
  playersSelectedColors,
  onColorClick,
}) => {
  const isUnavailable = playersSelectedColors[color] || selectedColor === color
  const imgWidth = getImageWidth(color)
  const imgHeight = 136

  return (
    <Box
      onClick={() => onColorClick(color)}
      sx={{
        ml: getMarginLeft(color),
        transition: "transform 0.3s ease-in-out",
        cursor: isUnavailable ? "not-allowed" : "pointer",
        "&:hover": {
          transform: isUnavailable ? "none" : "translateY(-20px)",
        },
        "& img": {
          filter: isUnavailable ? "brightness(0.5)" : "none",
        },
      }}
    >
      <Tooltip
        title={`Selected by: ${playersSelectedColors[color] || ""}`}
        disableHoverListener={!playersSelectedColors[color]}
        arrow
      >
        <img
          src={`/${color}.png`}
          alt={`${color} pen`}
          width={imgWidth}
          height={imgHeight}
        />
      </Tooltip>
    </Box>
  )
}

const getImageWidth = (color: string) => {
  switch (color) {
    case "orange":
      return 35
    case "green":
      return 40
    case "purple":
    case "darkpink":
      return 20
    default:
      return 30
  }
}

const getMarginLeft = (color: string) => {
  switch (color) {
    case "lightgreen":
      return "0.4em"
    case "darkblue":
      return "0.2em"
    case "purple":
      return "0.3em"
    case "darkpink":
      return "0.5em"
    default:
      return "0em"
  }
}

const useGameCode = () => {
  const params = useSearchParams()
  return params.get("gameCode") || ""
}

export default PenPicker
