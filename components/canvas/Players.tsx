"use client"
import React, { useEffect, useState } from "react"
import { Box, Skeleton, Typography } from "@mui/material"
import { useSearchParams } from "next/navigation"

const Players = () => {
  const [players, setPlayers] = useState<string[] | null>(null)
  const gameCode = useGameCode()

  setupWebSocket(gameCode, setPlayers)

  return (
    <StyledPlayersBox>
      <PlayerHeader />
      {players == null ? <LoadingPlayers /> : <PlayerList players={players} />}
    </StyledPlayersBox>
  )
}

const useGameCode = () => {
  const params = useSearchParams()
  return params.get("gameCode") || ""
}

const setupWebSocket = (gameCode: string, setPlayers: any) => {
  const websocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT
  if (!websocketURL) {
    throw "Websocket URL was not defined in this environment"
  }

  const socket = new WebSocket(websocketURL)

  useEffect(() => {
    socket.onopen = () => requestPlayersFromServer(socket, gameCode)
    socket.onmessage = (event) => updatePlayersFromServer(event, setPlayers)
  }, [])
}

const requestPlayersFromServer = (socket: WebSocket, gameCode: string) => {
  const getPlayers = {
    action: "getPlayers",
    gameCode: gameCode,
  }
  socket.send(JSON.stringify(getPlayers))
}

const updatePlayersFromServer = (event: any, setPlayers: any) => {
  const data = JSON.parse(event.data)
  if (data.action === "getPlayers") {
    setPlayers(data.players)
  }
}

const StyledPlayersBox = ({ children }: any) => (
  <Box
    sx={{
      border: "5px solid #DC1C74",
      borderRadius: "10px",
      padding: "1rem",
      overflow: "hidden",
      backgroundColor: "white",
      width: "fit-content",
    }}
  >
    {children}
  </Box>
)

const PlayerHeader = () => (
  <Typography
    variant="h6"
    sx={{ color: "#F10A7E", fontSize: 24, fontWeight: "bold" }}
  >
    Players
  </Typography>
)

const LoadingPlayers = () => (
  <>
    <LoadingPlayer />
    <LoadingPlayer />
    <LoadingPlayer />
    <LoadingPlayer />
    <LoadingPlayer />
  </>
)

const LoadingPlayer = () => (
  <Box
    display="flex"
    alignItems="center"
    marginY={1}
    width="100%"
    justifyContent="space-between"
  >
    <SkeletonComponent width={32} height={51} sx={{marginRight: "0.5rem"}} />
    <TypographySkeleton width={"3em"} marginRight={"1em"} />
    <SkeletonComponent width={25} height={25} sx={{marginRight: "0.2rem"}} />
    <SkeletonComponent width={25} height={25} sx={{marginLeft: "0.5rem"}} />
  </Box>
)

const SkeletonComponent = (props: any) => (
  <Skeleton variant="rectangular" animation="wave" {...props} />
)

const TypographySkeleton = (props: any) => (
  <Typography variant="h2" {...props}>
    <Skeleton />
  </Typography>
)

const PlayerList = ({ players }: { players: string[] }) => (
  <>
    {players.map((player, idx) => (
      <PlayerItem key={idx} player={player} />
    ))}
  </>
)

const PlayerItem = ({ player }: { player: string }) => (
  <Box
    display="flex"
    alignItems="center"
    marginY={1}
    width="100%"
    justifyContent="space-between"
  >
    <Box display="flex" alignItems="center">
      <PlayerImage />
      <PlayerName name={player} />
    </Box>
    <Coins />
  </Box>
)

const Coins = () => (
  <Box display="flex" alignItems="center" marginLeft={"3rem"}>
    <CoinSection src="/one_coin.png" alt="one coin" count={0} />
    <Box marginLeft={1}>
      <CoinSection src="/two_coin.png" alt="two coin" count={0} />
    </Box>
  </Box>
)

const CoinSection = ({
  src,
  alt,
  count,
}: {
  src: string
  alt: string
  count: number
}) => (
  <Box display="flex" alignItems="center">
    <CoinImage src={src} alt={alt} />
    <CoinText count={count} />
  </Box>
)

const PlayerImage = () => (
  <img
    src={"/player.png"}
    alt="player"
    style={{
      width: 32,
      height: 51,
      backgroundColor: "transparent",
      marginRight: "0.5rem",
    }}
  />
)

const PlayerName = ({ name }: { name: string }) => (
  <Typography variant="body1" sx={{ fontSize: 18, fontWeight: "bold" }}>
    {name}
  </Typography>
)

const CoinImage = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} style={{ width: 25, height: 25 }} />
)

const CoinText = ({ count }: { count: number }) => (
  <Typography
    variant="body1"
    sx={{ fontSize: 18, marginLeft: "0.2rem", fontWeight: "medium" }}
  >
    x{count}
  </Typography>
)

export default Players
