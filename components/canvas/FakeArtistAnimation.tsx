import React, { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
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
  backgroundColor: theme.palette.background.paper,
  borderRadius: "1rem",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "15%",
    width: "20px",
    height: "20px",
    backgroundColor: theme.palette.background.paper,
    transform: "translateY(50%) rotate(45deg)",
    clipPath:
      "polygon(-1px -1px, calc(100% + 1px) -1px, calc(100% + 1px) calc(100% + 1px))",
  },
}))

const FakeArtistThinking = () => {
  const [visibleDots, setVisibleDots] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleDots((prev) => (prev < 3 ? prev + 1 : 0))
    }, 500)
    return () => clearInterval(interval)
  }, [])
  return (
    <Box
      display="flex"
      alignItems="flex-start"
      position="relative"
      sx={{ p: 4, border: "none" }}
    >
      <img
        src={"/fake_artist_thinking.png"}
        alt="Thinking fake artist"
        style={{ width: "150px", height: "250px" }}
      />
      <Bubble elevation={5}>
        <Typography variant="body1" fontWeight={"bold"}>
          The title is:{" "}
          <span style={{ opacity: visibleDots > 0 ? 1 : 0 }}>.</span>
          <span style={{ opacity: visibleDots > 1 ? 1 : 0 }}>.</span>
          <span style={{ opacity: visibleDots > 2 ? 1 : 0 }}>.</span>
        </Typography>
      </Bubble>
    </Box>
  )
}

const FakeArtistGuessRight = ({
  fakeArtistGuess,
}: {
  fakeArtistGuess: string
}) => {
  return (
    <Box
      display="flex"
      alignItems="flex-start"
      position="relative"
      sx={{ p: 4, border: "none" }}
    >
      <img
        src={"/fake_artist_speaking_large.png"}
        alt="Speaking fake artist"
        style={{ width: "150px", height: "250px" }}
      />
      <Bubble elevation={5}>
        <Typography variant="body1" fontWeight={"bold"}>
          The title is: {fakeArtistGuess} ✅
        </Typography>
      </Bubble>
    </Box>
  )
}

const FakeArtistGuessWrong = ({
  fakeArtistGuess,
}: {
  fakeArtistGuess: string
}) => {
  return (
    <Box
      display="flex"
      alignItems="flex-start"
      position="relative"
      sx={{ p: 4, border: "none" }}
    >
      <img
        src={"/fake_artist_speaking_large.png"}
        alt="Speaking fake artist"
        style={{ width: "150px", height: "250px" }}
      />
      <Bubble elevation={5}>
        <Typography variant="body1" fontWeight={"bold"}>
          The title is: {fakeArtistGuess} ❌
        </Typography>
      </Bubble>
    </Box>
  )
}

const FakeArtistAnimation = ({
  fakeArtistGuessedRight,
  fakeArtistGuessedWrong,
  fakeArtistGuess,
}: {
  fakeArtistGuessedRight: boolean
  fakeArtistGuessedWrong: boolean
  fakeArtistGuess: string
}) => {
  if (fakeArtistGuessedRight) {
    return <FakeArtistGuessRight fakeArtistGuess={fakeArtistGuess} />
  }

  if (fakeArtistGuessedWrong) {
    return <FakeArtistGuessWrong fakeArtistGuess={fakeArtistGuess} />
  }

  return <FakeArtistThinking />
}

export default FakeArtistAnimation
