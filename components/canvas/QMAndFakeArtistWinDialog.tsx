import { Box, DialogContent, DialogTitle, Typography } from "@mui/material"
import React from "react"

const PlayerName = ({ player }: { player: string }) => (
  <Typography variant="h6">{player}</Typography>
)

const Player = ({ name, image }: { name: string; image: string }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <img src={image} alt="fake artist" width={150} height={227} />
      <PlayerName player={name} />
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <img src="/two_coin.png" alt="two coin" width={25} height={27} />
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
      Fake Artist and Question Master win:
    </Typography>
  </Box>
)

const QMAndFakeArtistWinDialog = ({
  fakeArtist,
  questionMaster,
}: {
  fakeArtist: string
  questionMaster: string
}) => {
  return (
    <Box
      bgcolor="white"
      borderRadius={2}
      paddingLeft={4}
      paddingRight={4}
      width={"40em"}
      height={"24em"}
    >
      <DialogTitle>
        <DialogTitleBox />
      </DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="center" alignItems="center" gap={4}>
          <Player name={fakeArtist} image="/fake_artist.png" />
          <Player name={questionMaster} image="/question_master.png" />
        </Box>
      </DialogContent>
    </Box>
  )
}

export default QMAndFakeArtistWinDialog
