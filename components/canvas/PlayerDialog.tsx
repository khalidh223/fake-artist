import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material"
import React from "react"
import PenPicker from "./PenPicker"
import { PenChosenData } from "@/app/canvas/page"
import { useUser } from "@/app/UserProvider"

const PlayerDialog = ({
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
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            You are a Player!
          </Typography>
          <img src="/player_large.png" alt="Image" width={120} height={173} />
          <Box mt={2} mb={2}>
            <Typography variant="body1" fontWeight={"bold"} gutterBottom>
              Find the Fake Artist!
            </Typography>
          </Box>
          <Box maxWidth={"20em"}>
            <Typography variant="body2" gutterBottom>
              The <strong>Question Master</strong> shares the title with all but
              one player — the <strong>Fake Artist.</strong> You get two rounds
              to make a single mark, <i>without</i> releasing your click. Earn
              points by identifying the Fake Artist!
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

export default PlayerDialog
