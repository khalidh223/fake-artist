"use client"

import Box from "@mui/material/Box"
import HomeButtons from "@/components/home/HomeButtons"
import { useUser } from "./UserProvider"
import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const { playerSocket, setPlayerSocket, role } = useUser()

  useEffect(() => {
    if (!playerSocket) {
      if (process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT == null) {
        throw Error("Websocket URL was not defined in this environment")
      }
      const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT)
      setPlayerSocket(ws)
    }
  }, [])

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
        </motion.div>
      )}
    </AnimatePresence>
  )
}
