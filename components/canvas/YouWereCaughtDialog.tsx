"use client"

import { Box, Button, DialogContent, Typography } from "@mui/material"
import React, { useState } from "react"
import { OptionType, sendWebSocketMessage } from "./utils"
import WordSearchSelect from "./WordSearchSelect"

const YouWereCaughtDialog = ({
  canvasWebSocket,
  gameCode,
}: {
  canvasWebSocket: WebSocket | null
  gameCode: string
}) => {
  const [title, setTitle] = useState("")
  const [selectedTitle, setSelectedTitle] = useState<OptionType | undefined>(
    undefined
  )

  const handleTitleSelectChange = (option: OptionType | null) => {
    setSelectedTitle(option ?? undefined)
    setTitle(option ? option.value : "")
  }

  const handleSubmitTitle = () => {
    sendWebSocketMessage(canvasWebSocket, {
      action: "sendFakeArtistGuess",
      gameCode,
      title,
    })
  }

  return (
    <Box
      bgcolor="white"
      borderRadius={2}
      paddingLeft={4}
      paddingRight={4}
      width={"40em"}
      height={"24em"}
      sx={{ overflowY: "visible" }}
    >
      <DialogContent sx={{ overflowY: "visible" }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
        >
          <Box mt={2}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              You were caught!
            </Typography>
          </Box>
          <Box mt={2} mb={14} maxWidth={"20em"}>
            <Typography variant="body1" gutterBottom>
              But, you and the Question Master still have an opportunity to earn
              points <i>if</i> you can guess the title correctly!
            </Typography>
          </Box>
          <Box display={"flex"} flexDirection={"row"} gap={2}>
            <Typography variant="body1">What is the title?</Typography>
            <Box marginTop={"-8px"} width={"15em"}>
              <WordSearchSelect
                placeholder="Title"
                onChange={handleTitleSelectChange}
                value={selectedTitle}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="text"
          disabled={title === ""}
          onClick={handleSubmitTitle}
        >
          Submit
        </Button>
      </Box>
    </Box>
  )
}

export default YouWereCaughtDialog
