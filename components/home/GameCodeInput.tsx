"use client"

import React, { useRef } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box'
import { styled } from '@mui/material';

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white',
            borderWidth: '2px',
            borderRadius: '8px',
            lineHeight: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.38)',
        },
    },
    '& .MuiOutlinedInput-input': {
        color: '#ffffff',
        width: '20px',          // Small width
        height: '20px',         // Small height
        textAlign: 'center',
        fontSize: '20px'
    }
});

const GameCodeInput: React.FC = () => {
    const refs = Array.from({ length: 6 }).map(() => useRef<HTMLInputElement | null>(null));

    const handleInputChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (value && refs[index + 1]) {
            refs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number) => (event: React.KeyboardEvent) => {
        if (event.key === 'Backspace' && refs[index].current?.value === '' && refs[index - 1]) {
            refs[index - 1].current?.focus();
        }
    };

    return (
        <Box display="flex" justifyContent="center" gap={1}>
            {refs.map((ref, index) => (
                <StyledTextField
                    key={index}
                    variant="outlined"
                    color="primary"
                    inputProps={{
                        maxLength: 1
                    }}
                    inputRef={ref}
                    onChange={handleInputChange(index)}
                    onKeyDown={handleKeyDown(index)}
                />
            ))}
        </Box>
    );
}

export default GameCodeInput;
