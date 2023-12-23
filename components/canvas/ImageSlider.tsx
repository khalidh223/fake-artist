import React, { useState, useEffect } from "react"
import { Box } from "@mui/material"

type ImageArray = {
  src: string
  alt: string
  width: number
  height: number
}[]

const ImageSlider: React.FC<{ images: ImageArray }> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((currentIndex) => (currentIndex + 1) % images.length)
    }, 1500)

    return () => clearInterval(intervalId)
  }, [images.length])

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "250px",
        overflow: "hidden",
      }}
    >
      {images.map((image, index) => {
        let transform
        if (index === currentImageIndex) {
          transform = "translate(-50%, -50%)"
        } else if (index === (currentImageIndex + 1) % images.length) {
          transform = "translate(-150%, -50%)"
        } else {
          transform = "translate(50%, -50%)"
        }

        return (
          <img
            key={image.src}
            src={image.src}
            alt={image.alt}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: transform,
              width: image.width,
              height: image.height,
              transition: "transform 1s, opacity 1s",
              opacity: index === currentImageIndex ? 1 : 0,
            }}
          />
        )
      })}
    </Box>
  )
}

export default ImageSlider
