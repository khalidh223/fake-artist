"use client"

import React from "react"
import DrawCanvas from "@/components/canvas/DrawCanvas"
import Border from "./Border"
import { Box, Typography } from "@mui/material"

const THEME_COLOR = "#DC1C74"
const BORDER_COLOR = "#000000"

const Sketchpad = () => {
  return (
    <StyledSketchpadBox>
      <ThemeAndTitleBox />
      <ContentBox />
    </StyledSketchpadBox>
  )
}

type StyledSketchpadBoxProps = {
  children: React.ReactNode
}

const StyledSketchpadBox = ({ children }: StyledSketchpadBoxProps) => (
  <Box
    sx={{
      width: "33%",
      maxWidth: "500px",
      height: "80vh",
      bgcolor: "white",
      position: "relative",
      p: 2,
      m: 4,
      borderTop: `0 solid transparent`,
      borderLeft: `0 solid transparent`,
      borderBottom: `15px solid ${BORDER_COLOR}`,
      borderRight: `15px solid ${BORDER_COLOR}`,
    }}
  >
    {children}
  </Box>
)

const ThemeAndTitleBox = () => (
  <Box
    sx={{
      color: THEME_COLOR,
      mb: 1,
      padding: 0,
    }}
  >
    <Typography variant="subtitle1" gutterBottom>
      Theme
    </Typography>
    <Box
      component="hr"
      sx={{ borderColor: THEME_COLOR, m: 0, mb: 1, width: "100%" }}
    />
    <Typography variant="subtitle1">Title</Typography>
  </Box>
)

const ContentBox = () => (
  <Box
    sx={{
      position: "absolute",
      top: "90px",
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden",
    }}
  >
    <DrawCanvas />
    <Border position="top" />
    <Border position="bottom" />
    <Border position="left" />
    <Border position="right" />
  </Box>
)

export default Sketchpad
