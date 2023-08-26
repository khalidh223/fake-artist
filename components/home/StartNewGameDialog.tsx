import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'

const StartNewGameDialog = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
    return (
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiPaper-root': { backgroundColor: '#73053C', color: '#fff', width: '80%', maxWidth: '400px' } }}>
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
            <DialogContent sx={{ padding: '1.5rem' }}>
                <Box display="flex" justifyContent="center">
                    <TextField
                        style={{ width: '60%' }}
                        variant="standard"
                        placeholder="Username"
                        margin="normal"
                    />
                </Box>
                <Typography variant="h6" textAlign="center" mt={2}>
                    Your game code is:
                </Typography>
                <Typography variant="h4" textAlign="center" fontWeight="bold" mt={1}>
                    345678
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', padding: '1rem' }}>
                <Typography variant="caption">
                    1 Player · Invite your friends!
                </Typography>
                <Button onClick={onClose} color="inherit" variant="text">
                    Start
                </Button>
            </DialogActions>
        </Dialog>

    )
}

export default StartNewGameDialog