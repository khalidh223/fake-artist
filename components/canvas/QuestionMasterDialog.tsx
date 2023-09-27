"use client"

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material"
import React, { useState } from "react"

const QuestionMasterDialog = () => {
  const [theme, setTheme] = useState("")
  const [title, setTitle] = useState("")

  const isDoneDisabled = !theme.trim() || !title.trim()

  return (
    <Dialog open={true}>
      <DialogContent
        sx={{ textAlign: "center", minWidth: "400px", paddingBottom: 1 }}
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
            <TextField
              fullWidth
              variant="standard"
              placeholder="Animals"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
          </Box>
          <Box width="45%">
            <Box marginLeft={"-2em"} marginBottom={"0.2em"}>
              <Typography variant="body2">② What is your title?</Typography>
            </Box>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Lion"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
          <Button variant="text" disabled={isDoneDisabled} sx={{ ml: 2 }}>
            Done
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default QuestionMasterDialog
