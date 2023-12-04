"use client"

import Box from "@mui/material/Box"
import HomeButtons from "@/components/home/HomeButtons"
import { useUser } from "./UserProvider"
import { useEffect } from "react"

export default function Home() {
  const { playerSocket, setPlayerSocket } = useUser()

  useEffect(() => {
    if (!playerSocket) {
      if (process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT == null) {
        throw Error("Websocket URL was not defined in this environment")
      }
      const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT)
      setPlayerSocket(ws)
    }
  }, [])

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        flexDirection={"column"}
      >
        <Box display={"flex"} flexDirection={"column"} width={"371px"}>
          <img
            src={"/splash.png"}
            alt="splash image"
            style={{ maxWidth: "100%", maxHeight: "80vh" }}
          />
          <HomeButtons />
        </Box>
      </Box>
    </>
  )
}
