import { Box, Typography } from "@mui/material";
import React from "react";

interface DialogTitleBoxProps {
    countdownMessage: string;
}
export const DialogTitleBox: React.FC<DialogTitleBoxProps> = ({
    countdownMessage,
}) => (
    <Box
        display="flex"
        alignItems="center"
        marginY={1}
        width="100%"
        justifyContent="space-between"
    >
        <Box display="flex" alignItems="center">
            <img
                src="/qm_speaking.png"
                alt="question master"
                style={{
                    width: 42,
                    height: 66,
                    backgroundColor: "transparent",
                    marginRight: "0.5rem",
                }} />
            <Typography variant="h6" align="center" color={"black"}>
                {countdownMessage}
            </Typography>
        </Box>
    </Box>
);
