"use client"

import { useUser } from "@/app/UserProvider"
import {
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { OptionType, sendWebSocketMessage } from "./utils"
import WordSearchSelect from "./WordSearchSelect"

const QuestionMasterDialog = ({
  gameCode,
  allPlayersConfirmedColor,
}: {
  gameCode: string
  allPlayersConfirmedColor: boolean
}) => {
  const [theme, setTheme] = useState("")
  const [title, setTitle] = useState("")
  const [selectedTheme, setSelectedTheme] = useState<OptionType | undefined>(
    undefined
  )
  const [selectedTitle, setSelectedTitle] = useState<OptionType | undefined>(
    undefined
  )
  const [isOpen, setIsOpen] = useState(true)
  const [isBackDropOpen, setIsBackDropOpen] = useState(false)

  const {
    playerSocket,
    setShowQMChip,
    setCurrentPlayerDrawing,
    players,
    username,
    setThemeChosenByQuestionMaster,
    setTitleChosenByQuestionMaster,
    setExittedTitleCard,
    themeChosenByQuestionMaster,
    titleChosenByQuestionMaster,
    currentPlayerDrawing,
  } = useUser()

  const isDoneDisabled = !theme.trim() || !title.trim()

  useEffect(() => {
    if (allPlayersConfirmedColor) {
      setIsBackDropOpen(false)
    }
  }, [allPlayersConfirmedColor, isOpen])

  useEffect(() => {
    if (
      themeChosenByQuestionMaster != "" &&
      titleChosenByQuestionMaster != "" &&
      allPlayersConfirmedColor
    ) {
      setShowQMChip(true)
    }
  }, [
    themeChosenByQuestionMaster,
    titleChosenByQuestionMaster,
    allPlayersConfirmedColor,
  ])

  const handleClickDone = () => {
    sendWebSocketMessage(playerSocket, {
      action: "sendThemeAndTitleChosenByQuestionMaster",
      theme: theme,
      title: title,
      gameCode,
    })
    setThemeChosenByQuestionMaster(theme)
    setTitleChosenByQuestionMaster(title)
    setExittedTitleCard(true)
    setIsOpen(false)
    setIsBackDropOpen(true)
    if (players != null) {
      const sortedPlayers = players
        .sort()
        .filter((player) => player != username)
      if (currentPlayerDrawing == "") {
        setCurrentPlayerDrawing(sortedPlayers[0])
      }
    }
  }

  const handleThemeSelectChange = (option: OptionType | null) => {
    setSelectedTheme(option ?? undefined)
    setTheme(option ? option.value : "")
  }

  const handleTitleSelectChange = (option: OptionType | null) => {
    setSelectedTitle(option ?? undefined)
    setTitle(option ? option.value : "")
  }

  return (
    <>
      <Dialog open={isOpen} PaperProps={{ style: { overflowY: "visible" } }}>
        <DialogContent
          sx={{
            textAlign: "center",
            minWidth: "400px",
            paddingBottom: 1,
            overflowY: "visible",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            You are the Question Master!
          </Typography>
          <Box mt={2} mb={4}>
            <img
              src={"/question_master.png"}
              alt="Image"
              width={120}
              height={173}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" mb={4}>
            <Box width="45%">
              <Box marginLeft={"-1em"} marginBottom={"0.2em"}>
                <Typography variant="body2">① What is your theme?</Typography>
              </Box>
              <WordSearchSelect
                placeholder="Animal"
                onChange={handleThemeSelectChange}
                value={selectedTheme}
              />
            </Box>
            <Box width="45%">
              <Box marginLeft={"-2em"} marginBottom={"0.2em"}>
                <Typography variant="body2">② What is your title?</Typography>
              </Box>
              <WordSearchSelect
                placeholder="Lion"
                onChange={handleTitleSelectChange}
                value={selectedTitle}
              />
            </Box>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt="auto"
          >
            <Typography variant="body2" fontSize={10} sx={{ flexGrow: 1 }}>
              ⓘ You earn points if the fake artist wins, so pick an easy title!
            </Typography>
            <Button
              variant="text"
              disabled={isDoneDisabled}
              sx={{ ml: 2 }}
              onClick={handleClickDone}
            >
              Done
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Backdrop
        open={isBackDropOpen && !allPlayersConfirmedColor}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Typography variant="h5" fontWeight={"bold"}>
          Waiting for all players to select their pen...
        </Typography>
      </Backdrop>
    </>
  )
}

export default QuestionMasterDialog
