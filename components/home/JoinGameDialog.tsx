"use client"

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'
import GameCodeInput from './GameCodeInput'

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

const Content = () => {
    return (
        <DialogContent sx={{ padding: '1.5rem' }}>
            <UsernameTextField />
            <GameCodeContent />
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

const GameCodeContent = () => {
    return (
        <>
            <Typography variant="h6" textAlign="center" mt={2}>
                Enter your game code!
            </Typography>
            <Box mt={3}>
                <GameCodeInput />
            </Box>
        </>
    )
}

const Footer = ({ onClose }: { onClose: () => void }) => {
    return (
        <DialogActions sx={{ justifyContent: 'flex-end', padding: '1rem' }}>
            <Button onClick={onClose} color="inherit" variant="text">
                Join
            </Button>
        </DialogActions>
    )
}

const JoinGameDialog = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
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
            <Content />
            <Footer onClose={onClose} />
        </Dialog>
    )
}

export default JoinGameDialog