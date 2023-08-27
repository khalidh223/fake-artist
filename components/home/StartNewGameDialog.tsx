import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'

const TitleAndCloseButton = ({ onClose }: { onClose: () => void }) => {
    return (
        <DialogTitle sx={{ position: 'relative', textAlign: 'center', paddingLeft: '2.5rem', paddingBottom: '1rem' }}>
            Enter your username!
            <IconButton
                edge="end"
                color="inherit"
                onClick={onClose}
                aria-label="close"
                sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }}
            >
                <CloseIcon />
            </IconButton>
        </DialogTitle>
    )
}

const Content = ({ gameCode }: { gameCode: string | null }) => {
    return (
        <DialogContent sx={{ padding: '1.5rem' }}>
            <UsernameTextField />
            <GameCodeContent gameCode={gameCode} />
        </DialogContent>
    )
}

const UsernameTextField = () => {
    const InputProps = {
        style: {
            color: 'white',
            borderBottom: '1px solid white'
        },
        inputProps: {
            style: {
                color: 'white'
            }
        }
    }

    return (
        <Box display="flex" justifyContent="center">
            <TextField
                style={{ width: '60%' }}
                variant="standard"
                placeholder="Username"
                margin="normal"
                InputProps={InputProps}
            />
        </Box>
    )
}

const GameCodeContent = ({ gameCode }: { gameCode: string | null }) => {
    if (gameCode == null) {
        return (
            <Typography>Cannot get a new game code, please try again later.</Typography>
        )
    }
    return (
        <>
            <Typography variant="h6" textAlign="center" mt={2}>
                Your game code is:
            </Typography>
            <Typography variant="h4" textAlign="center" fontWeight="bold" mt={1}>
                {gameCode}
            </Typography>
        </>
    )
}

const Footer = ({ onClose }: { onClose: () => void }) => {
    return (
        <DialogActions sx={{ justifyContent: 'space-between', padding: '1rem' }}>
            <Typography variant="caption">
                1 Player · Invite your friends!
            </Typography>
            <Button onClick={onClose} color="inherit" variant="text">
                Start
            </Button>
        </DialogActions>
    )
}

const StartNewGameDialog = ({ open, onClose, gameCode }: { open: boolean, onClose: () => void, gameCode: string | null }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root':
                {
                    backgroundColor: '#73053C',
                    color: '#fff',
                    width: '80%',
                    maxWidth: '400px'
                }
            }}
        >
            <TitleAndCloseButton onClose={onClose} />
            <Content gameCode={gameCode} />
            <Footer onClose={onClose} />
        </Dialog>
    )
}

export default StartNewGameDialog