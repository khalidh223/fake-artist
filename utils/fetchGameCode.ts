export default async function fetchGameCode(): Promise<string | null> {
    const endpoint = process.env.NEXT_PUBLIC_GAME_CODE_API
    
    if (!endpoint) {
        console.error('API endpoint not set');
        return null;
    }
    
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch game code');
      }
      const data = await response.json();
      return data.gameCode;
    } catch (error) {
      console.error('Error fetching game code:', error);
      return null;
    }
  }
  