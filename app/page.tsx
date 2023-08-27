import Box from '@mui/material/Box'
import HomeButtons from '@/components/home/HomeButtons'
import fetchGameCode from '@/utils/fetchGameCode';
import Image from 'next/image'
import splashImage from '@/public/splash.png'

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
          <Box sx={{ maxWidth: '100%', maxHeight: '80vh' }}>
            <Image src={splashImage} width={undefined} height={undefined} alt='splash image' />
          </Box>
          <HomeButtons gameCode={gameCode} />
        </Box>
      </Box>
    </>
  );
}