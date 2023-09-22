import Players from "@/components/canvas/Players"
import Sketchpad from "@/components/canvas/Sketchpad"
import Box from "@mui/material/Box"

export default function Home() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >

      <Players />
      <Sketchpad />
    </Box>
  )
}