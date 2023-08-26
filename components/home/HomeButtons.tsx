"use client"
import { Button, Stack, styled } from '@mui/material'
import React, { useState } from 'react'
import StartNewGameDialog from './StartNewGameDialog'

const HomeButton = styled(Button)({
    borderColor: '#F10A7E',
    color: '#F10A7E',
    '&:hover': {
        borderColor: '#FFF000',
    }
})

const HomeButtons = () => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };
    return (
        <>
            <Stack spacing={2} mt={4} width={'100%'}>
                <HomeButton fullWidth variant={"outlined"} onClick={handleOpenDialog}>
                    Start new game
                </HomeButton>
                <HomeButton fullWidth variant={"outlined"}>
                    Join game
                </HomeButton>
            </Stack>
            <StartNewGameDialog open={dialogOpen} onClose={handleCloseDialog} />
        </>
    )
}

export default HomeButtons