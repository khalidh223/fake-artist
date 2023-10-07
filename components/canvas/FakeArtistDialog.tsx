"use client"

import React from "react"
import { Dialog, DialogContent, Typography, Button, Box } from "@mui/material"
import PenPicker from "./PenPicker"
import { PenChosenData } from "@/app/canvas/page"
import { useUser } from "@/app/UserProvider"

const FakeArtistDialog = ({
  penChosen,
  canvasWebSocket,
}: {
  penChosen: PenChosenData | null
  canvasWebSocket: WebSocket | null
}) => {
  const { hexCodeOfColorChosen } = useUser()
  return (
    <Dialog open={true} fullWidth maxWidth="xs">
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
        >
          <Box mt={2}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              You are the Fake Artist!
            </Typography>
          </Box>
          <img src="/fake_artist.png" alt="Image" width={120} height={173} />
          <Box mt={2} mb={2}>
            <Typography variant="body1" fontWeight={"bold"} gutterBottom>
              Fake it till you make it.
            </Typography>
          </Box>
          <Box maxWidth={"20em"}>
            <Typography variant="body2" gutterBottom>
              You will see the theme, but not the title - earn points by not
              getting caught, or by guessing the title correctly if caught!
            </Typography>
          </Box>
          <Box mt={2}>
            <Typography variant="body1" fontWeight={"bold"} gutterBottom>
              Pick your color:
            </Typography>
          </Box>
          <Box mb={-4}>
            <PenPicker
              penChosen={penChosen}
              canvasWebSocket={canvasWebSocket}
            />
          </Box>
        </Box>
      </DialogContent>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button variant="text" disabled={hexCodeOfColorChosen == null}>
          Done
        </Button>
      </Box>
    </Dialog>
  )
}

export default FakeArtistDialog
