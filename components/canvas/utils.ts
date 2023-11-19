export const sendWebSocketMessage = (socket: WebSocket | null, data: object) => {
  if (!socket) return

  const send = () => {
    socket.send(JSON.stringify(data))
  }

  if (socket.readyState === WebSocket.OPEN) {
    send()
  } else {
    socket.addEventListener("open", send)
    return () => {
      socket.removeEventListener("open", send)
    }
  }
}
