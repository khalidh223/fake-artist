import { useUser } from "@/app/UserProvider"
import {
  Box,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
} from "@mui/material"
import { styled } from "@mui/system"
import React from "react"

const StyledButton = styled(Button)({
  borderColor: "#F10A7E",
  color: "#F10A7E",
})

const PlayersGrid = ({ players }: { players: string[] | undefined }) => (
  <>
    <Box display="flex" justifyContent="center" alignItems="center" gap={4}>
      {players?.slice(0, 4).map((player, index) => (
        <Player key={index} name={player} image="/player_large.png" />
      ))}
    </Box>
    {players && players.length > 4 && (
      <Box display="flex" justifyContent="center" alignItems="center" gap={4}>
        {players?.slice(4).map((player, index) => (
          <Player key={index} name={player} image="/player_large.png" />
        ))}
      </Box>
    )}
  </>
)

const PlayerName = ({ player }: { player: string }) => (
  <Typography variant="h6">{player}</Typography>
)

const Player = ({ name, image }: { name: string; image: string }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <img src={image} alt="fake artist" width={150} height={227} />
      <PlayerName player={name} />
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <img src="/one_coin.png" alt="one coin" width={25} height={27} />
        <Typography variant="h6" ml={0.5}>
          x1
        </Typography>
      </Box>
    </Box>
  )
}

const DialogTitleBox = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    marginY={1}
    width="100%"
  >
    <Typography variant="h6" align="center">
      Players win:
    </Typography>
  </Box>
)

const PlayersWinDialog = ({
  playersWithoutQMAndFakeArtist,
  handleExitDialog,
}: {
  playersWithoutQMAndFakeArtist: string[] | undefined
  handleExitDialog: () => void
}) => {
  return (
    <>
      <DialogTitle>
        <DialogTitleBox />
      </DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <PlayersGrid players={playersWithoutQMAndFakeArtist} />
          <Box mt={"1em"}>
            <StyledButton variant="outlined" onClick={handleExitDialog}>
              Okay
            </StyledButton>
          </Box>
        </Box>
      </DialogContent>
    </>
  )
}

export default PlayersWinDialog
