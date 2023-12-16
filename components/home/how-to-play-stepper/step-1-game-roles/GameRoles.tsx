import React from "react"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { pink, blue, grey } from "@mui/material/colors"
import { Box } from "@mui/material"

// Define the role information type
interface RoleInfo {
  color: string
  title: string
  description: string[]
  icon: string
  width: number
  height: number
}

const roles: RoleInfo[] = [
  {
    color: pink[500],
    title: "Question Master",
    description: [
      "Decide the theme & title, writes the title on the title cards.",
      "Cannot participate in drawing.",
      "Can earn points if the fake artist wins.",
      "It's important to choose an easy title in order to help the fake artist.",
    ],
    icon: "question_master.png",
    width: 94,
    height: 136,
  },
  {
    color: blue[500],
    title: "Fake Artist",
    description: [
      "Must draw without knowing the title.",
      "Can earn points if not caught out by the other artists.",
      "If caught, they must state the correct title.",
      "Fake it till you make it: Act like you know the title.",
    ],
    icon: "fake_artist.png",
    width: 94,
    height: 136,
  },
  {
    color: grey[500],
    title: "Player",
    description: [
      "Make two marks per turn on the same canvas.",
      "Can earn points if they guess the identity of the fake artist.",
      "Don't reveal the title amongst each other nor the fake artist.",
    ],
    icon: "player_large.png",
    width: 94,
    height: 136,
  },
]

const RoleCard: React.FC<{ role: RoleInfo }> = ({ role }) => (
  <Card
    sx={{
      display: "flex",
      marginBottom: 2,
      borderLeft: `10px solid ${role.color}`,
      borderRadius: "0",
    }}
  >
    <Box mt={"1em"}>
      <img
        src={role.icon}
        alt={`${role.title} icon`}
        width={role.width}
        height={role.height}
      />
    </Box>
    <CardContent
      sx={{ flex: "1 0 auto", "&:last-child": { paddingBottom: "16px" } }}
    >
      <Typography variant="h6" component="div" gutterBottom>
        {role.title}
      </Typography>
      {role.description.map((line, index) => (
        <Typography
          key={index}
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: "4px" }}
        >
          {line}
        </Typography>
      ))}
    </CardContent>
  </Card>
)

const GameRoles: React.FC = () => (
  <div>
    {roles.map((role, index) => (
      <RoleCard key={index} role={role} />
    ))}
  </div>
)

export default GameRoles
