"use client"
import React, { useEffect } from "react"
import { Box, Skeleton, Typography } from "@mui/material"
import {
  PlayerToNumberOfOneCoins,
  PlayerToNumberOfTwoCoins,
  useUser,
} from "@/app/UserProvider"

const Players = ({
  socket,
  gameCode,
  questionMaster,
}: {
  socket: WebSocket | null
  gameCode: string
  questionMaster: string
}) => {
  const {
    players,
    currentPlayerDrawing,
    playerToNumberOfTwoCoins,
    playerToNumberOfOneCoins,
  } = useUser()

  useSetupWebSocket(gameCode, socket)

  return (
    <StyledPlayersBox>
      <PlayerHeader />
      {players == null ? (
        <LoadingPlayers />
      ) : (
        <PlayerList
          players={players.sort()}
          questionMaster={questionMaster}
          currentPlayerDrawing={currentPlayerDrawing}
          playerToNumberOfTwoCoins={playerToNumberOfTwoCoins}
          playerToNumberOfOneCoins={playerToNumberOfOneCoins}
        />
      )}
    </StyledPlayersBox>
  )
}

const useSetupWebSocket = (gameCode: string, socket: WebSocket | null) => {
  useEffect(() => {
    if (socket) {
      requestPlayersFromServer(socket, gameCode)
    }
  }, [socket, gameCode])
}

const requestPlayersFromServer = (socket: WebSocket, gameCode: string) => {
  const getPlayers = {
    action: "getPlayers",
    gameCode: gameCode,
  }
  socket.send(JSON.stringify(getPlayers))
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
    <SkeletonComponent width={32} height={51} sx={{ marginRight: "0.5rem" }} />
    <TypographySkeleton width={"3em"} marginRight={"1em"} />
    <SkeletonComponent width={25} height={25} sx={{ marginRight: "0.2rem" }} />
    <SkeletonComponent width={25} height={25} sx={{ marginLeft: "0.5rem" }} />
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

const PlayerList = ({
  players,
  questionMaster,
  currentPlayerDrawing,
  playerToNumberOfTwoCoins,
  playerToNumberOfOneCoins
}: {
  players: string[]
  questionMaster: string
  currentPlayerDrawing: string
  playerToNumberOfTwoCoins: PlayerToNumberOfTwoCoins
  playerToNumberOfOneCoins: PlayerToNumberOfOneCoins
}) => (
  <>
    {players.map((player, idx) => (
      <PlayerItem
        key={idx}
        player={player}
        questionMaster={questionMaster}
        underlinePlayer={player === currentPlayerDrawing}
        numberOfTwoCoins={playerToNumberOfTwoCoins[player]}
        numberOfOneCoins={playerToNumberOfOneCoins[player]}
      />
    ))}
  </>
)

const PlayerItem = ({
  player,
  questionMaster,
  underlinePlayer,
  numberOfTwoCoins,
  numberOfOneCoins,
}: {
  player: string
  questionMaster: string
  underlinePlayer: boolean
  numberOfTwoCoins: number
  numberOfOneCoins: number
}) => (
  <Box
    display="flex"
    alignItems="center"
    marginY={1}
    width="100%"
    justifyContent="space-between"
  >
    <Box display="flex" alignItems="center">
      <PlayerImage questionMaster={questionMaster} name={player} />
      <PlayerName name={player} underlinePlayer={underlinePlayer} />
    </Box>
    <Coins
      numberOfTwoCoins={numberOfTwoCoins}
      numberOfOneCoins={numberOfOneCoins}
    />
  </Box>
)

const Coins = ({
  numberOfTwoCoins,
  numberOfOneCoins,
}: {
  numberOfTwoCoins: number
  numberOfOneCoins: number
}) => (
  <Box display="flex" alignItems="center" marginLeft={"3rem"}>
    <CoinSection src="/one_coin.png" alt="one coin" count={numberOfOneCoins} />
    <Box marginLeft={1}>
      <CoinSection
        src="/two_coin.png"
        alt="two coin"
        count={numberOfTwoCoins}
      />
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

const PlayerImage = ({
  questionMaster,
  name,
}: {
  questionMaster: string
  name: string
}) => {
  if (questionMaster == name) {
    return (
      <img
        src={"/question_master_icon.png"}
        alt="player"
        style={{
          width: 32,
          height: 51,
          backgroundColor: "transparent",
          marginRight: "0.5rem",
        }}
      />
    )
  }

  return (
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
}

const PlayerName = ({
  name,
  underlinePlayer,
}: {
  name: string
  underlinePlayer: boolean
}) => (
  <Typography
    variant="body1"
    sx={{
      fontSize: 18,
      fontWeight: "bold",
      textDecoration: underlinePlayer ? "underline" : "none",
    }}
  >
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
