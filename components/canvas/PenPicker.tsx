import { Box } from "@mui/material"
import React from "react"

const PenPicker = () => {
  return (
    <Box display="flex" justifyContent="center" mt={2}>
      <Box
        sx={{
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-20px)",
          },
        }}
      >
        <img src="/brown.png" alt="Image" width={30} height={136} />
      </Box>
      <Box
        sx={{
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-20px)",
          },
        }}
      >
        <img src="/black.png" alt="Image" width={30} height={136} />
      </Box>
      <Box
        sx={{
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-20px)",
          },
        }}
      >
        <img src="/red.png" alt="Image" width={30} height={136} />
      </Box>
      <Box
        sx={{
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-20px)",
          },
        }}
      >
        <img src="/orange.png" alt="Image" width={30} height={136} />
      </Box>
      <Box
        sx={{
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-20px)",
          },
        }}
      >
        <img src="/yellow.png" alt="Image" width={25} height={136} />
      </Box>
      <Box
        ml={"0.4em"}
        sx={{
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-20px)",
          },
        }}
      >
        <img src="/lightgreen.png" alt="Image" width={25} height={136} />
      </Box>
      <Box
        sx={{
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-20px)",
          },
        }}
      >
        <img src="/green.png" alt="Image" width={30} height={136} />
      </Box>
      <Box
        sx={{
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-20px)",
          },
        }}
      >
        <img src="/lightblue.png" alt="Image" width={25} height={136} />
      </Box>
      <Box
        ml={"0.2em"}
        sx={{
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-20px)",
          },
        }}
      >
        <img src="/darkblue.png" alt="Image" width={25} height={136} />
      </Box>
      <Box
        ml={"0.3em"}
        sx={{
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-20px)",
          },
        }}
      >
        <img src="/purple.png" alt="Image" width={20} height={136} />
      </Box>
      <Box
        ml={"0.5em"}
        sx={{
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-20px)",
          },
        }}
      >
        <img src="/darkpink.png" alt="Image" width={20} height={136} />
      </Box>
      <Box
        ml={"0.3em"}
        sx={{
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-20px)",
          },
        }}
      >
        <img src="/pink.png" alt="Image" width={30} height={136} />
      </Box>
    </Box>
  )
}

export default PenPicker
