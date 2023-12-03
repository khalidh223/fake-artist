"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useMemo,
} from "react"
import { io, Socket } from "socket.io-client"

const DrawSocketContext = createContext<Socket | null>(null)

type DrawSocketProviderProps = {
  children: ReactNode
}

export const DrawSocketProvider: React.FC<DrawSocketProviderProps> = ({ children }) => {
  if (process.env.NEXT_PUBLIC_GAME_WEBSOCKET_ENDPOINT == null) {
    throw "game websocket url is not defined in environment"
  }

  const socket = useMemo(() => {
    return io(`${process.env.NEXT_PUBLIC_GAME_WEBSOCKET_ENDPOINT}`, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelayMax: 5000,
    })
  }, [])

  return (
    <DrawSocketContext.Provider value={socket}>{children}</DrawSocketContext.Provider>
  )
}

export const useDrawSocket = () => {
  return useContext(DrawSocketContext)
}
