import React, { useState } from "react"
import AnimatedSVG from "./AnimatedSVG"
import CircleSVG from "./CircleSVG"
import ManeSVG from "./ManeSVG"
import BodySVG from "./BodySVG"
import Box from "@mui/material/Box"
import LeftLegSVG from "./LeftLegSVG"
import RightLegSVG from "./RightLegSVG"
import TailSVG from "./TailSVG"
import LeftEyeSVG from "./LeftEyeSVG"
import RightEyeSVG from "./RightEyeSVG"

const LionAnimation = () => {
  const [isCircleSVGCompleted, setIsCircleSVGCompleted] = useState(false)
  const [isManeSVGCompleted, setIsManeSVGCompleted] = useState(false)
  const [isBodySVGCompleted, setIsBodySVGCompleted] = useState(false)
  const [isLeftLegSVGCompleted, setIsLeftLegSVGCompleted] = useState(false)
  const [isRightLegSVGCompleted, setIsRightLegSVGCompleted] = useState(false)
  const [isTailSVGCompleted, setIsTailSVGCompleted] = useState(false)
  const [isLeftEyeSVGCompleted, setIsLeftEyeSVGCompleted] = useState(false)

  const handleCircleSVGAnimationEnd = () => {
    setIsCircleSVGCompleted(true)
  }

  const handleManeSVGAnimationEnd = () => {
    setIsManeSVGCompleted(true)
  }

  const handleBodySVGAnimationEnd = () => {
    setIsBodySVGCompleted(true)
  }

  const handleLeftLegSVGAnimationEnd = () => {
    setIsLeftLegSVGCompleted(true)
  }

  const handleRightLegSVGAnimationEnd = () => {
    setIsRightLegSVGCompleted(true)
  }

  const handleTailSVGAnimationEnd = () => {
    setIsTailSVGCompleted(true)
  }

  const handleLeftEyeSVGAnimationEnd = () => {
    setIsLeftEyeSVGCompleted(true)
  }

  return (
    <Box
      sx={{
        position: "relative",
        height: "412px",
        width: "540px",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Left player image and red line */}
      <Box
        component="img"
        src="/player_large_clear.png"
        alt="Player 1"
        sx={{
          position: "absolute",
          top: 10,
          left: 10,
          height: "93px",
          width: "56px",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "105px",
          left: 10,
          height: "10px",
          width: "56px",
          backgroundColor: "red",
        }}
      />

      {/* Right player image and blue line */}
      <Box
        component="img"
        src="/player_large_clear.png"
        alt="Player 2"
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          height: "93px",
          width: "56px",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "105px",
          right: 10,
          height: "10px",
          width: "56px",
          backgroundColor: "blue",
        }}
      />

      {/* Bottom left player image and green line */}
      <Box
        component="img"
        src="/player_large_clear.png"
        alt="Player 3"
        sx={{
          position: "absolute",
          bottom: 10,
          left: 10,
          height: "93px",
          width: "56px",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "0px",
          left: 10,
          height: "10px",
          width: "56px",
          backgroundColor: "green",
        }}
      />

      {/* Bottom right player image and light pink bar */}
      <Box
        component="img"
        src="/player_large_clear.png"
        alt="Player 4"
        sx={{
          position: "absolute",
          bottom: 10,
          right: 10,
          height: "93px",
          width: "56px",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "0px",
          right: 10,
          height: "10px",
          width: "56px",
          backgroundColor: "#AA336A",
        }}
      />

      {/* Animated SVGs */}
      <AnimatedSVG
        svg={<CircleSVG />}
        duration={2}
        onAnimationEnd={handleCircleSVGAnimationEnd}
        nudgeRight={"6em"}
        nudgeDown={"0em"}
      />
      {isCircleSVGCompleted && (
        <AnimatedSVG
          svg={<ManeSVG />}
          duration={3}
          nudgeRight={"6em"}
          nudgeDown={"0em"}
          onAnimationEnd={handleManeSVGAnimationEnd}
        />
      )}
      {isManeSVGCompleted && (
        <AnimatedSVG
          svg={<BodySVG />}
          duration={3}
          nudgeRight={"-4em"}
          nudgeDown={"0em"}
          onAnimationEnd={handleBodySVGAnimationEnd}
        />
      )}
      {isBodySVGCompleted && (
        <AnimatedSVG
          svg={<LeftLegSVG />}
          duration={3}
          nudgeRight={"-4em"}
          nudgeDown={"3.5em"}
          onAnimationEnd={handleLeftLegSVGAnimationEnd}
        />
      )}
      {isLeftLegSVGCompleted && (
        <AnimatedSVG
          svg={<RightLegSVG />}
          duration={3}
          nudgeRight={"-8em"}
          nudgeDown={"3.5em"}
          onAnimationEnd={handleRightLegSVGAnimationEnd}
        />
      )}
      {isRightLegSVGCompleted && (
        <AnimatedSVG
          svg={<TailSVG />}
          duration={3}
          nudgeRight={"-10em"}
          nudgeDown={"-0.5em"}
          onAnimationEnd={handleTailSVGAnimationEnd}
        />
      )}
      {isTailSVGCompleted && (
        <AnimatedSVG
          svg={<LeftEyeSVG />}
          duration={3}
          nudgeRight={"3em"}
          nudgeDown={"2em"}
          onAnimationEnd={handleLeftEyeSVGAnimationEnd}
        />
      )}
      {isLeftEyeSVGCompleted && (
        <AnimatedSVG
          svg={<RightEyeSVG />}
          duration={3}
          nudgeRight={"0em"}
          nudgeDown={"2em"}
        />
      )}
    </Box>
  )
}

export default LionAnimation
