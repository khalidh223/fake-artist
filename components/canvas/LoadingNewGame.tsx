import { Box, Typography } from "@mui/material"
import React from "react"
import ImageSlider from "./ImageSlider"

const LoadingNewGame = () => {
  const images = [
    { src: "/qm_thinking.png", alt: "qm thinking", width: 150, height: 250 },
    { src: "/qm_speaking.png", alt: "qm speaking", width: 150, height: 250 },
    {
      src: "/fake_artist_speaking_large.png",
      alt: "fake artist speaking",
      width: 150,
      height: 250,
    },
    {
      src: "/fake_artist_thinking.png",
      alt: "fake artist thinking",
      width: 150,
      height: 250,
    },
  ]

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      flexDirection={"column"}
    >
      <Box display={"flex"} flexDirection={"column"}>
        <ImageSlider images={images} />
        <Typography
          variant="h5"
          fontWeight={"bold"}
          sx={{ marginTop: 4, color: "white" }}
        >
          Loading new game...
        </Typography>
      </Box>
    </Box>
  )
}

export default LoadingNewGame
