"use client"
import { Paper } from "@mui/material"
import { styled, keyframes } from "@mui/system"

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
  backgroundColor: "aliceblue",
  borderRadius: "1rem",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "15%",
    width: "20px",
    height: "20px",
    backgroundColor: "aliceblue",
    transform: "translateY(50%) rotate(45deg)",
    clipPath:
      "polygon(-1px -1px, calc(100% + 1px) -1px, calc(100% + 1px) calc(100% + 1px))",
  },
}))

export default Bubble
