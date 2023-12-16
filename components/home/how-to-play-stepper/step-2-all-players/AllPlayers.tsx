import React, { useState, useEffect } from "react"

// Define the props for the image paths
interface AnimatedImagesProps {
  imagePaths: string[] // Paths to the 5 images to be displayed in the row
  bottomImagePath: string // Path to the image to be displayed below
}

const AllPlayers: React.FC<AnimatedImagesProps> = ({
  imagePaths,
  bottomImagePath,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(-1)
  const [bottomImageVisible, setBottomImageVisible] = useState(false)

  useEffect(() => {
    if (currentImageIndex < imagePaths.length) {
      const timer = setTimeout(() => {
        setCurrentImageIndex(currentImageIndex + 1)
      }, 400) // Change 1000 to the desired interval between fades

      return () => clearTimeout(timer)
    } else {
      // After the last image in the row fades in, fade in the bottom image
      const timer = setTimeout(() => {
        setBottomImageVisible(true)
      }, 200) // Delay before the bottom image fades in

      return () => clearTimeout(timer)
    }
  }, [currentImageIndex, imagePaths.length])

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {imagePaths.map((path, index) => (
          <img
            key={index}
            src={path}
            width={111}
            height={186}
            alt={`Animated ${index}`}
            style={{
              opacity: index <= currentImageIndex ? 1 : 0,
              transition: "opacity 0.2s ease-in-out",
              transform:
                index <= currentImageIndex
                  ? "translateX(0)"
                  : "translateX(-100px)",
            }}
          />
        ))}
      </div>
      <div
        style={{
          marginTop: "20px",
          opacity: bottomImageVisible ? 1 : 0,
          transition: "opacity 1s ease-in-out",
          marginLeft: "9em"
        }}
      >
        <img
          src={bottomImagePath}
          width={262}
          height={140}
          alt="Bottom Animated"
        />
      </div>
    </div>
  )
}

export default AllPlayers
