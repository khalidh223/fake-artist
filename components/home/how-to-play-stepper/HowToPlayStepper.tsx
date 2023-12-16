import React, { useState } from "react"
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  Button,
  Dialog,
  IconButton,
} from "@mui/material"

import CloseIcon from "@mui/icons-material/Close"
import GameRoles from "./step-1-game-roles/GameRoles"
import AllPlayers from "./step-2-all-players/AllPlayers"
import QMAnnouncesThemeWritesTitle from "./step-3-qm-announce-theme/QMAnnouncesThemeWritesTitle"
import PassOutCardsAnimation from "./step-4-pass-out-cards/PassOutCardsAnimation"
import LionAnimation from "./step-5-lion-animation/LionAnimation"
import QMCountDown from "./step-6-qm-count-down/QMCountDown"
import FadeInFakeArtist from "./step-7-fade-in-fake-artist/FadeInFakeArtist"
import PointsDistributionImage from "./step-8-point-distribution/PointsDistributionImage"

// Types for steps
interface StepData {
  description: string | null
  content: React.ReactElement | null
}

// Steps data
const steps: StepData[] = [
  {
    description: "Here are the different types of artists.",
    content: <GameRoles />,
  },
  {
    description: `The Question Master is randomly picked for the first round & the same number of cards as remaining players are chosen.`,
    content: (
      <AllPlayers
        imagePaths={[
          "/player_large_clear.png",
          "/player_large_clear.png",
          "/qm_speaking.png",
          "/player_large_clear.png",
          "/player_large_clear.png",
        ]}
        bottomImagePath="/multicards.png"
      />
    ),
  },
  {
    description: `The Question Master chooses a theme & announces it to all players. The QM writes an "X" on the back of one card, and the title on the rest.`,
    content: <QMAnnouncesThemeWritesTitle />,
  },
  {
    description:
      "The cards are shuffled, and placed in front of each player. Each player turns over the card - whoever gets the 'X' is the secret, fake artist.",
    content: <PassOutCardsAnimation />,
  },
  {
    description:
      "The Players select a color marker. Each player makes two marks, drawing the title. This continues for two rounds.",
    content: <LionAnimation />,
  },
  {
    description:
      "After the second round, the Question Master will count down from three. The Players then vote for who they believe is the fake artist.",
    content: <QMCountDown />,
  },
  {
    description:
      "If the Fake Artist is pointed to the most, they must reveal their identity. They must say the correct title to earn points for them & the QM!",
    content: <FadeInFakeArtist />,
  },
  {
    description:
      "This is how points are distributed between artists. The first player to reach 5 points wins!",
    content: <PointsDistributionImage />,
  },
]

const HowToPlayStepper: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onClose() // Close the stepper on the last step
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <IconButton
        onClick={onClose}
        style={{ position: "absolute", top: 10, left: '0.3em', color: "white", padding: '2px'}}
      >
        <CloseIcon />
      </IconButton>
      <Paper
        style={{ padding: "24px", backgroundColor: "#73053C", color: "white" }}
      >
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          nonLinear
          style={{ marginBottom: "16px" }}
        >
          {steps.map((_, index) => (
            <Step key={index} completed={index < activeStep}>
              <StepLabel />
            </Step>
          ))}
        </Stepper>
        <div>
          <Typography
            variant="body1"
            textAlign={"center"}
            style={{ fontWeight: "bold", marginBottom: "4em" }}
          >
            {steps[activeStep].description}
          </Typography>
          
          {steps[activeStep].content}
          
          <div
            style={{
              display: "flex",
              justifyContent: activeStep === 0 ? "flex-end" : "space-between",
              marginTop: "16px",
            }}
          >
            {activeStep > 0 && (
              <Button onClick={handleBack} style={{ color: "white" }}>
                Back
              </Button>
            )}
            <Button onClick={handleNext} style={{ color: "white" }}>
              {activeStep === steps.length - 1 ? "Close" : "Next"}
            </Button>
          </div>
        </div>
      </Paper>
    </Dialog>
  )
}

export default HowToPlayStepper
