import { Box, Typography } from "@mui/material"
import React from "react"

const MobileComingSoonAd: React.FC = () => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignContent={"center"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <img src="/sad_qm.png" width={187} height={312} style={{marginBottom: '-5em', marginTop: '3em'}}></img>
      <Typography variant="h2" fontWeight={"bold"} color={"white"} mt={"2em"}>
        Sorry.
      </Typography>
      <Typography
        variant="h6"
        fontWeight={"bold"}
        color={"white"}
        mt={"2em"}
        textAlign={"center"}
      >
        You need to be on desktop to play Fake Artist Online.
      </Typography>
      <Typography
        variant="body1"
        color={"white"}
        mt={"2em"}
        textAlign={"center"}
        fontSize={"1.1rem"}
      >
        Fake Artist Online coming soon to iOS!
      </Typography>
    </Box>
  )
}

export default MobileComingSoonAd
