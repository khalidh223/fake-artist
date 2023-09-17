"use client"

import React, { useState } from "react"
import DrawCanvas from "@/components/home/DrawCanvas"
import Border from "./Border"
import { Box, Typography } from "@mui/material"
import { useSearchParams } from "next/navigation"
import Peer, { DataConnection } from "peerjs"

const SketchpadComponent = () => {
  // Extract gameCode and isHost from URL
  // const params = useSearchParams()
  // const gameCode = params.get("gameCode") || ""
  // const wsConnection = new WebSocket("ws:127.0.0.1:8081", "json");
  // const isHost = params.get("isHost") === "true"

  // Initialize peer and connection
  // const [peer] = useState(
  //   isHost && gameCode
  //     ? new Peer(gameCode, {
  //         host: "localhost",
  //         port: 9000,
  //         path: "/",
  //       })
  //     : new Peer({
  //         host: "localhost",
  //         port: 9000,
  //         path: "/",
  //       })
  // )

  // const [connection, setConnection] = useState<DataConnection | null>(null)

  return (
    <Box
      sx={{
        width: "33%",
        maxWidth: "500px",
        height: "80vh",
        bgcolor: "white",
        position: "relative",
        p: 2,
        m: 4,
        borderTop: "0 solid transparent",
        borderLeft: "0 solid transparent",
        borderBottom: "15px solid #000000",
        borderRight: "15px solid #000000",
      }}
    >
      {/* Theme & Title Text */}
      <Box
        sx={{
          color: "#DC1C74",
          mb: 1,
          padding: 0, // Explicitly set padding to 0
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          Theme
        </Typography>
        <Box
          component="hr"
          sx={{ borderColor: "#DC1C74", m: 0, mb: 1, width: "100%" }}
        />
        <Typography variant="subtitle1">Title</Typography>
      </Box>

      {/* Main Content with Borders */}
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
        <DrawCanvas
          // peer={peer}
          // isHost={isHost}
          // connection={connection}
          // gameCode={gameCode}
          // color="#DC1C74"
        />
        <Border position="top" />
        <Border position="bottom" />
        <Border position="left" />
        <Border position="right" />
      </Box>
    </Box>
  )
}

export default SketchpadComponent
