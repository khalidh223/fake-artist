import React from "react"
import Bubble from "../../../canvas/Bubble"
import { Box, Typography } from "@mui/material"

const QMAnnouncesThemeWritesTitle = () => {
  return (
    <Box ml={"4em"} mt={'-2em'} display="flex" alignItems="start">
      <Box mt={'1em'}>
        <Box
          sx={{
            position: "absolute",
            marginTop: "-2em",
            marginLeft: "4em",
            zIndex: 10,
          }}
        >
          <Bubble>
            <Typography variant="body1" fontWeight={"bold"}>
              Animals!
            </Typography>
          </Bubble>
        </Box>

        <Box
          sx={{
            position: "relative",
            width: 70,
            height: 112,
          }}
        >
          <img
            src="/qm_speaking.png"
            alt="Question Master Speaking"
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
          />
        </Box>
      </Box>

      {/* New Box right next to the second-level Box, rendering an image */}
      <Box mt={"0.5em"}  ml={"10em"}>
        <img
          src="/example_title_card.png"
          width={116}
          height={52}
        />
        <img
          src="/example_title_card.png"
          width={116}
          height={52}
        />
        <img
          src="/example_title_card.png"
          width={116}
          height={52}
        />
        <img
          src="/example_x_card.png"
          width={116}
          height={52}
        />
      </Box>
    </Box>
  )
}

export default QMAnnouncesThemeWritesTitle
