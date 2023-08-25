import { Button, Stack } from '@mui/material';
import Box from '@mui/material/Box'


export default function Home() {
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
          <img src={'/splash.png'} style={{ maxWidth: '100%', maxHeight: '80vh' }} />
          <Stack spacing={2} mt={4} width={'100%'}>
            <Button variant="outlined" fullWidth sx={{ borderColor: '#F10A7E', color: '#F10A7E' }}>
              Start new game
            </Button>
            <Button variant="outlined" fullWidth sx={{ borderColor: '#F10A7E', color: '#F10A7E' }}>
              Join game
            </Button>
          </Stack>
        </Box>
      </Box>
    </>
  );
}