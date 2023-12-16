import { Box } from "@mui/material"
import React from "react"

const CoinsImage = () => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      marginTop={'-2em'}
    >
      <img src="/coins_image.png" />
    </Box>
  )
}

export default CoinsImage
