import * as React from "react"
import { styled, keyframes } from "@mui/system"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`

const flip = keyframes`
  from {
    transform: rotateX(0deg);
  }
  to {
    transform: rotateX(180deg);
  }
`

const ImageContainer = styled(Box)(({ theme }) => ({
  width: "935px",
  height: "419px",
  perspective: "1000px",
  position: "relative",
}))

const Card = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  position: "relative",
  transformStyle: "preserve-3d",
  animation: `${slideIn} 1s forwards, ${flip} 1s forwards 3s`,
}))

const possible_images = [
  "blue",
  "brown",
  "dark_red",
  "gray",
  "green",
  "orange",
  "pink",
  "red",
  "yellow",
  "dark_teal",
]

const CardFront = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  position: "absolute",
  backfaceVisibility: "hidden",
  backgroundImage: `url("title_card_${
    possible_images[Math.floor(Math.random() * possible_images.length)]
  }.png")`,
  backgroundSize: "cover",
}))

const CardBack = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  position: "absolute",
  backfaceVisibility: "hidden",
  backgroundColor: theme.palette.background.paper,
  transform: "rotateX(180deg)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
}))

type CornerImageProps = {
  src: string
}

const CornerImage = styled(({ src, ...other }: CornerImageProps) => (
  <Box {...other} />
))(({ src, theme }) => ({
  position: "absolute",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  width: "216px",
  height: "208px",
  backgroundImage: `url(${src})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
}))

const SlidingFlippingTitleCard = ({ title }: { title: string | null }) => {
  return (
    <ImageContainer>
      <Card>
        <CardFront />
        <CardBack>
          <Box textAlign="center">
            <Typography variant={"h3"} color={"black"}>
              The title is:
            </Typography>
            <Box>
              <Typography
                color={"black"}
                fontWeight={"bold"}
                sx={{
                  fontFamily: "Caveat Brush, cursive",
                  fontSize: "10rem",
                }}
              >
                {title ? title : "X"}
              </Typography>
            </Box>
          </Box>
          <CornerImage
            src={
              title
                ? "/corner_image_title_card_player.png"
                : "/corner_image_title_card_fake_artist.png"
            }
          />
        </CardBack>
      </Card>
    </ImageContainer>
  )
}

export default SlidingFlippingTitleCard
