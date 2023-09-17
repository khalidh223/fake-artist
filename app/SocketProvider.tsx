"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useMemo,
} from "react"
import { io, Socket } from "socket.io-client"

const SocketContext = createContext<Socket | null>(null)

type SocketProviderProps = {
  children: ReactNode
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
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

  useEffect(() => {
    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export const useSocket = () => {
  return useContext(SocketContext)
}
