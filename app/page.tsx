import Box from '@mui/material/Box'
import HomeButtons from '@/components/home/HomeButtons'
import fetchGameCode from '@/utils/fetchGameCode';

export default async function Home() {
  const gameCode = await fetchGameCode()
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        flexDirection={'column'}
      >
        <Box display={"flex"} flexDirection={"column"} width={"371px"}>
          <img src={'/splash.png'} alt='splash image' style={{ maxWidth: '100%', maxHeight: '80vh' }} />
          <HomeButtons gameCode={gameCode} />
        </Box>
      </Box>
    </>
  );
}