import React, { useEffect, useRef } from "react"
import Box from "@mui/material/Box"

interface AnimatedSVGProps {
  svg: JSX.Element
  duration?: number
  onAnimationEnd?: () => void
  nudgeRight: string | null
  nudgeDown: string | null
}

const AnimatedSVG: React.FC<AnimatedSVGProps> = ({
  svg,
  duration = 1,
  onAnimationEnd,
  nudgeRight,
  nudgeDown
}) => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const paths = svgRef.current?.querySelectorAll("path")
    if (paths && paths.length > 0) {
      const lastPath = paths[paths.length - 1]
      const length = lastPath.getTotalLength()
      lastPath.style.strokeDasharray = `${length}`
      lastPath.style.strokeDashoffset = `${length}`
      lastPath.style.animation = `draw ${duration}s forwards`

      const onEnd = () => {
        onAnimationEnd?.()
        lastPath.removeEventListener("animationend", onEnd)
      }

      lastPath.addEventListener("animationend", onEnd)
    }
  }, [duration, onAnimationEnd])

  return (
    <Box
      component="svg"
      ref={svgRef}
      viewBox={svg.props.viewBox}
      sx={{
        position: "absolute",
        top: nudgeDown,
        right: nudgeRight,
        width: "100%",
        height: "100%",
        "& path": {
          // Default styles for paths
        },
        "@keyframes draw": {
          to: {
            strokeDashoffset: 0,
          },
        },
      }}
    >
      {svg}
    </Box>
  )
}

export default AnimatedSVG
