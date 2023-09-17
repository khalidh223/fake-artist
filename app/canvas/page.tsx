import SketchpadComponent from "@/components/home/SketchpadComponent"
import Box from "@mui/material/Box"

export default function Home() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh" // full viewport height
    >
      <SketchpadComponent />
    </Box>
  )
}
