"use client"
import { Button, Stack, styled } from '@mui/material'
import React, { useState } from 'react'
import StartNewGameDialog from './StartNewGameDialog'
import JoinGameDialog from './JoinGameDialog'

const HomeButton = styled(Button)({
    borderColor: '#F10A7E',
    color: '#F10A7E',
    '&:hover': {
        borderColor: '#FFF000',
    }
})

const HomeButtons = ({ gameCode }: { gameCode: string | null }) => {
    const [dialogNewGameOpen, setNewGameDialogOpen] = useState(false)
    const [dialogJoinGameOpen, setJoinGameDialogOpen] = useState(false)
    const handleNewGameOpenDialog = () => {
        setNewGameDialogOpen(true);
    }

    const handleNewGameCloseDialog = () => {
        setNewGameDialogOpen(false);
    }
    
    const handleJoinGameOpenDialog = () => {
        setJoinGameDialogOpen(true);
    }
    
    const handleJoinGameCloseDialog = () => {
        setJoinGameDialogOpen(false);
    }
    return (
        <>
            <Stack spacing={2} mt={4} width={'100%'}>
                <HomeButton fullWidth variant={"outlined"} onClick={handleNewGameOpenDialog}>
                    Start new game
                </HomeButton>
                <HomeButton fullWidth variant={"outlined"} onClick={handleJoinGameOpenDialog}>
                    Join game
                </HomeButton>
            </Stack>
            <StartNewGameDialog open={dialogNewGameOpen} onClose={handleNewGameCloseDialog} gameCode={gameCode} />
            <JoinGameDialog open={dialogJoinGameOpen} onClose={handleJoinGameCloseDialog} />
        </>
    )
}

export default HomeButtons