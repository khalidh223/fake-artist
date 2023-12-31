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
  questionMaster: string
  setQuestionMaster: React.Dispatch<React.SetStateAction<string>>
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
  gameEnded: boolean
  setGameEnded: React.Dispatch<React.SetStateAction<boolean>>
  canvasBitmapAtEndOfGame: string
  setCanvasBitmapAtEndOfGame: React.Dispatch<React.SetStateAction<string>>
  playerToNumberOfFakeArtistVotes: PlayerToNumberOfFakeArtistVotes
  setPlayerToNumberOfFakeArtistVotes: React.Dispatch<
    React.SetStateAction<PlayerToNumberOfFakeArtistVotes>
  >
  fakeArtist: string
  setFakeArtist: React.Dispatch<React.SetStateAction<string>>
  playerToNumberOfTwoCoins: PlayerToNumberOfTwoCoins
  setPlayerToNumberOfTwoCoins: React.Dispatch<
    React.SetStateAction<PlayerToNumberOfTwoCoins>
  >
  playerToNumberOfOneCoins: PlayerToNumberOfOneCoins
  setPlayerToNumberOfOneCoins: React.Dispatch<
    React.SetStateAction<PlayerToNumberOfOneCoins>
  >
  fakeArtistGuessAndActualTitle: {
    fakeArtistGuess: string
    actualTitle: string
  }
  setFakeArtistGuessAndActualTitle: React.Dispatch<
    React.SetStateAction<{
      fakeArtistGuess: string
      actualTitle: string
    }>
  >
  setAllPlayersResettedRoundState: React.Dispatch<React.SetStateAction<boolean>>
  allPlayersResettedRoundState: boolean
  setRole: React.Dispatch<React.SetStateAction<"FAKE_ARTIST" | "PLAYER" | "QUESTION_MASTER" | null>>
  role: "FAKE_ARTIST" | "PLAYER" | "QUESTION_MASTER" | null
  setGameCode: React.Dispatch<React.SetStateAction<string>>
  gameCode: string
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

type UserProviderProps = {
  children: ReactNode
}

export type PlayerToConfirmedHexColorMap = {
  [player: string]: string
}

export type PlayerToNumberOfFakeArtistVotes = {
  [player: string]: number
}

export type PlayerToNumberOfTwoCoins = {
  [player: string]: number
}

export type PlayerToNumberOfOneCoins = {
  [player: string]: number
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
  const [questionMaster, setQuestionMaster] = useState<string>("")
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
  const [gameEnded, setGameEnded] = useState(false)
  const [canvasBitmapAtEndOfGame, setCanvasBitmapAtEndOfGame] = useState("")
  const [playerToNumberOfFakeArtistVotes, setPlayerToNumberOfFakeArtistVotes] =
    useState<PlayerToNumberOfFakeArtistVotes>({})
  const [fakeArtist, setFakeArtist] = useState("")
  const [playerToNumberOfTwoCoins, setPlayerToNumberOfTwoCoins] =
    useState<PlayerToNumberOfTwoCoins>({})
  const [playerToNumberOfOneCoins, setPlayerToNumberOfOneCoins] =
    useState<PlayerToNumberOfOneCoins>({})
  const [fakeArtistGuessAndActualTitle, setFakeArtistGuessAndActualTitle] =
    useState({ fakeArtistGuess: "", actualTitle: "" })
  const [allPlayersResettedRoundState, setAllPlayersResettedRoundState] =
    useState(false)
    const [role, setRole] = useState<
    "FAKE_ARTIST" | "PLAYER" | "QUESTION_MASTER" | null
  >(null)
  const [gameCode, setGameCode] = useState<string>("")

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
        gameEnded,
        setGameEnded,
        canvasBitmapAtEndOfGame,
        setCanvasBitmapAtEndOfGame,
        playerToNumberOfFakeArtistVotes,
        setPlayerToNumberOfFakeArtistVotes,
        fakeArtist,
        setFakeArtist,
        playerToNumberOfTwoCoins,
        setPlayerToNumberOfTwoCoins,
        playerToNumberOfOneCoins,
        setPlayerToNumberOfOneCoins,
        setFakeArtistGuessAndActualTitle,
        fakeArtistGuessAndActualTitle,
        setAllPlayersResettedRoundState,
        allPlayersResettedRoundState,
        setRole,
        role,
        setGameCode,
        gameCode
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
