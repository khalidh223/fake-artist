import { SetStateAction } from "react"

export default async function fetchGameCode(
  setGameCode: (value: SetStateAction<string | null>) => void,
  setHasFetchedGameCode: (value: SetStateAction<boolean>) => void,
  setLoading: (value: SetStateAction<boolean>) => void,
  username: string
): Promise<string | null> {
  setLoading(true)
  const endpoint = "/api/fetchGameCode"
  if (!endpoint) {
    console.error("API endpoint not set")
    return null
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username }),
    })
    if (!response.ok) {
      throw new Error("Failed to fetch game code")
    }
    const data = await response.json()
    setGameCode(data.gameCode)
    setHasFetchedGameCode(true)
    setLoading(false)
    return data.gameCode
  } catch (error) {
    console.error("Error fetching game code:", error)
    setLoading(false)
    return null
  }
}
