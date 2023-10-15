"use client"

import React, { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { styled, keyframes } from "@mui/system"

const imageUrl = "/qm_thinking.png"
const bounce = keyframes`
  0% {
    transform: scale(0.1);
    opacity: 0;
  }
  60% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
`

const Bubble = styled(Paper)(({ theme }) => ({
  animation: `${bounce} 1s ease`,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: "1rem",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "15%",
    width: "20px",
    height: "20px",
    backgroundColor: theme.palette.background.paper,
    transform: "translateY(50%) rotate(45deg)",
    clipPath:
      "polygon(-1px -1px, calc(100% + 1px) -1px, calc(100% + 1px) calc(100% + 1px))",
  },
}))

const QuestionMasterThinking: React.FC = () => {
  const [visibleDots, setVisibleDots] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleDots((prev) => (prev < 3 ? prev + 1 : 0))
    }, 500)
    return () => clearInterval(interval)
  }, [])
  return (
    <Box
      display="flex"
      alignItems="flex-start"
      position="relative"
      sx={{ p: 4, border: "none" }}
    >
      <img
        src={imageUrl}
        alt="Thinking question master"
        style={{ width: "150px", height: "250px" }}
      />
      <Bubble elevation={5}>
        <Typography variant="body1" fontWeight={"bold"}>
          The theme is:{" "}
          <span style={{ opacity: visibleDots > 0 ? 1 : 0 }}>.</span>
          <span style={{ opacity: visibleDots > 1 ? 1 : 0 }}>.</span>
          <span style={{ opacity: visibleDots > 2 ? 1 : 0 }}>.</span>
        </Typography>
      </Bubble>
    </Box>
  )
}

export default QuestionMasterThinking
