"use client"

import Box from "@mui/material/Box"
import HomeButtons from "@/components/home/HomeButtons"
import { useUser } from "./UserProvider"
import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { sendWebSocketMessage } from "@/components/canvas/utils"
import { useSearchParams } from "next/navigation"
import { Link, Typography } from "@mui/material"

export default function Home() {
  const { playerSocket, setPlayerSocket, role, username, gameCode } = useUser()

  useEffect(() => {
    if (!playerSocket) {
      if (process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT == null) {
        throw Error("Websocket URL was not defined in this environment")
      }
      const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT)
      setPlayerSocket(ws)
    }
  }, [])

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.returnValue = "" // Required for some browsers
    if (gameCode != "" && username != "") {
      sendWebSocketMessage(playerSocket, {
        action: "leaveGame",
        gameCode: gameCode,
        username: username,
      })
    }
    playerSocket?.close()
  }

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [gameCode, username])

  const pageVariants = {
    initial: { opacity: 0, transition: { duration: 0.5 } },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  }

  return (
    <AnimatePresence>
      {!role && (
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5 }}
        >
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
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            marginTop={"-4em"}
          >
            <Typography color={"#F20A7E"} fontWeight={"bold"}>
              Made by{" "}
              <Link
                color={"#F20A7E"}
                href="https://github.com/khalidh223"
                sx={{ textDecoration: "underline" }}
              >
                khalidh223
              </Link>{" "}
              | Issues? Suggestions? Submit them{" "}
              <Link
                color={"#F20A7E"}
                href="/feedback"
                sx={{ textDecoration: "underline" }}
              >
                here!
              </Link>
            </Typography>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
