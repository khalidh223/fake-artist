"use client"

import React, { createContext, useState, useContext, ReactNode } from "react"

interface UserContextValue {
  username: string
  setUsername: React.Dispatch<React.SetStateAction<string>>
  playerSocket: WebSocket | null
  setPlayerSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>
  connectionId: string
  setConnectionId: React.Dispatch<React.SetStateAction<string>>
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

type UserProviderProps = {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [username, setUsername] = useState<string>("")
  const [playerSocket, setPlayerSocket] = useState<WebSocket | null>(null)
  const [connectionId, setConnectionId] = useState<string>("")

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        playerSocket,
        setPlayerSocket,
        connectionId,
        setConnectionId,
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
