"use client"

import React, { useEffect, useRef, useState } from "react"
import TextField from "@mui/material/TextField"
import Box from "@mui/material/Box"
import { styled } from "@mui/material"

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
      borderWidth: "2px",
      borderRadius: "8px",
      lineHeight: "10px",
      backgroundColor: "rgba(255, 255, 255, 0.38)",
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "#ffffff",
    width: "20px",
    height: "20px",
    textAlign: "center",
    fontSize: "20px",
  },
})

interface GameCodeInputProps {
  setGameCode: (value: string) => void
}

const GameCodeInput: React.FC<GameCodeInputProps> = ({ setGameCode }) => {
  const [values, setValues] = useState(Array(6).fill(""))
  const [focusIndex, setFocusIndex] = useState<number | null>(null)
  const focusRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (focusRef.current && focusIndex !== null) {
      focusRef.current.focus()
    }
  }, [focusIndex])

  useEffect(() => {
    const newGameCode = values.join("")
    setGameCode(newGameCode)
  }, [values])

  const handleInputChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value
      if (!/^[a-zA-Z0-9]$/.test(value) && value !== "") {
        event.preventDefault()
        return
      }
      if (/[a-z]/.test(value)) {
        value = value.toUpperCase()
      }

      const newValues = [...values]
      newValues[index] = value
      setValues(newValues)

      if (value && index < 5) {
        setFocusIndex(index + 1)
      }
    }

  const handleKeyDown = (index: number) => (event: React.KeyboardEvent) => {
    if (event.key === "Backspace" && values[index] === "" && index > 0) {
      setFocusIndex(index - 1)
    }
  }

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault()
    const text = event.clipboardData.getData("text").toUpperCase()
    const regex = /^[A-Z0-9]{1,6}$/

    if (regex.test(text)) {
      const newValues = text.split("").slice(0, 6)
      setValues([...newValues, ...Array(6 - newValues.length).fill("")])
      setFocusIndex(newValues.length < 6 ? newValues.length : null)
    }
  }

  return (
    <>
      <Box display="flex" justifyContent="center" gap={1} onPaste={handlePaste}>
        {values.map((value, index) => (
          <StyledTextField
            key={index}
            variant="outlined"
            color="primary"
            value={value}
            inputProps={{
              maxLength: 1,
            }}
            inputRef={index === focusIndex ? focusRef : null}
            onChange={handleInputChange(index)}
            onKeyDown={handleKeyDown(index)}
          />
        ))}
      </Box>
    </>
  )
}

export default GameCodeInput
