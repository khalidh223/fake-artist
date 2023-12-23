import React, { useState, useEffect } from "react"
import { Box, Card, Typography } from "@mui/material"

interface FlipCardProps {
  imageSrc: string
  width: number
  height: number
  backContent: string
}

const FlipCard: React.FC<FlipCardProps> = ({
  imageSrc,
  backContent,
  width,
  height,
}) => {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    const flipTimer = setTimeout(() => setFlipped(true), 3000)
    return () => clearTimeout(flipTimer)
  }, [])

  return (
    <Box sx={{ perspective: "1000px", width, height }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          transition: "transform 0.8s",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front of the card */}
        <Card
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
          }}
        >
          <img src={imageSrc} alt="Front" width={width} height={height} />
        </Card>
        {/* Back of the card */}
        <Card
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <Typography
            variant="body2"
            fontFamily="Caveat Brush, cursive"
            fontSize={"2rem"}
            textAlign={"center"}
            marginBottom={"2em"}
          >
            {backContent}
          </Typography>
        </Card>
      </Box>
    </Box>
  )
}

const PassOutCardsAnimation: React.FC = () => {
  const [cardsVisible, setCardsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setCardsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Box sx={{ position: "relative" }}>
      {/* Top images */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        {[
          "/player_large_clear.png",
          "/player_large_clear.png",
          "/player_large_clear.png",
          "/player_large_clear.png",
        ].map((image_source, index) => (
          <img
            key={index}
            src={image_source}
            width={111}
            height={186}
            alt={`Player ${index}`}
          />
        ))}
      </Box>
      {/* Sliding and flipping cards */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          top: "150px",
          width: "100%",
          transition: "transform 1s, opacity 1s",
          transform: cardsVisible ? "translateY(0)" : "translateY(100%)",
          opacity: cardsVisible ? 1 : 0,
          marginTop: '1em'
        }}
      >
        {[
          "title_card_blue.png",
          "title_card_brown.png",
          "title_card_dark_red.png",
          "title_card_orange.png",
        ].map((image_source, index) => (
          <FlipCard
            key={index}
            width={116}
            height={52}
            imageSrc={image_source}
            backContent={index === 3 ? "X" : "Lion"}
          />
        ))}
      </Box>
    </Box>
  )
}

export default PassOutCardsAnimation
