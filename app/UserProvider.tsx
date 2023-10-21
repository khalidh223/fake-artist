"use client"

import React, { createContext, useState, useContext, ReactNode } from "react"

interface UserContextValue {
  username: string
  setUsername: React.Dispatch<React.SetStateAction<string>>
  playerSocket: WebSocket | null
  setPlayerSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>
  connectionId: string
  setConnectionId: React.Dispatch<React.SetStateAction<string>>
  hexCodeOfColorChosen: string | null
  setHexCodeOfColorChosen: React.Dispatch<React.SetStateAction<string | null>>
  titleChosenByQuestionMaster: string
  setTitleChosenByQuestionMaster: React.Dispatch<React.SetStateAction<string>>
  themeChosenByQuestionMaster: string
  setThemeChosenByQuestionMaster: React.Dispatch<React.SetStateAction<string>>
  players: string[] | null
  setPlayers: React.Dispatch<React.SetStateAction<string[] | null>>
  currentPlayerDrawing: string
  setCurrentPlayerDrawing: React.Dispatch<React.SetStateAction<string>>
  questionMaster: string | null
  setQuestionMaster: React.Dispatch<React.SetStateAction<string | null>>
  canvasDimensions: {
    width: number
    height: number
  }
  setCanvasDimensions: React.Dispatch<
    React.SetStateAction<{
      width: number
      height: number
    }>
  >
  closeSlidingImage: boolean
  setCloseSlidingImage: React.Dispatch<React.SetStateAction<boolean>>
  playerToConfirmedHexColor: PlayerToConfirmedHexColorMap
  setPlayerToConfirmedHexColor: React.Dispatch<
    React.SetStateAction<PlayerToConfirmedHexColorMap>
  >
  showQMChip: boolean
  setShowQMChip: React.Dispatch<React.SetStateAction<boolean>>
  allPlayersConfirmedColor: boolean
  setAllPlayersConfirmedColor: React.Dispatch<React.SetStateAction<boolean>>
  exittedTitleCard: boolean
  setExittedTitleCard: React.Dispatch<React.SetStateAction<boolean>>
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

type UserProviderProps = {
  children: ReactNode
}

export type PlayerToConfirmedHexColorMap = {
  [player: string]: string
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [username, setUsername] = useState<string>("")
  const [playerSocket, setPlayerSocket] = useState<WebSocket | null>(null)
  const [connectionId, setConnectionId] = useState<string>("")
  const [hexCodeOfColorChosen, setHexCodeOfColorChosen] = useState<
    string | null
  >(null)
  const [themeChosenByQuestionMaster, setThemeChosenByQuestionMaster] =
    useState<string>("")
  const [titleChosenByQuestionMaster, setTitleChosenByQuestionMaster] =
    useState<string>("")
  const [players, setPlayers] = useState<string[] | null>(null)
  const [currentPlayerDrawing, setCurrentPlayerDrawing] = useState("")
  const [questionMaster, setQuestionMaster] = useState<string | null>(null)
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: 0,
  })
  const [closeSlidingImage, setCloseSlidingImage] = useState(false)
  const [playerToConfirmedHexColor, setPlayerToConfirmedHexColor] =
    useState<PlayerToConfirmedHexColorMap>({})
  const [showQMChip, setShowQMChip] = useState(false)
  const [allPlayersConfirmedColor, setAllPlayersConfirmedColor] =
    useState(false)
  const [exittedTitleCard, setExittedTitleCard] = useState(false)

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        playerSocket,
        setPlayerSocket,
        connectionId,
        setConnectionId,
        hexCodeOfColorChosen,
        setHexCodeOfColorChosen,
        titleChosenByQuestionMaster,
        setTitleChosenByQuestionMaster,
        themeChosenByQuestionMaster,
        setThemeChosenByQuestionMaster,
        players,
        setPlayers,
        currentPlayerDrawing,
        setCurrentPlayerDrawing,
        questionMaster,
        setQuestionMaster,
        canvasDimensions,
        setCanvasDimensions,
        closeSlidingImage,
        setCloseSlidingImage,
        playerToConfirmedHexColor,
        setPlayerToConfirmedHexColor,
        showQMChip,
        setShowQMChip,
        allPlayersConfirmedColor,
        setAllPlayersConfirmedColor,
        exittedTitleCard,
        setExittedTitleCard,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
