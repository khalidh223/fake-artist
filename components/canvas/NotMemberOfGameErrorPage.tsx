"use client"

import { Box, Button, Typography, styled } from "@mui/material"
import { useRouter } from "next/navigation"
import React from "react"

const StyledButton = styled(Button)({
  borderColor: "#F10A7E",
  color: "#F10A7E",
  "&:hover": {
    borderColor: "#FFF000",
  },
})

const NotMemberOfGameErrorPage = () => {
  const router = useRouter()
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      flexDirection={"column"}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <img
          src={"/error_qm_mad.png"}
          alt="error mad qm"
          style={{ marginLeft: "12em" }}
        />
        <Box mt={"2em"}>
          <Typography
            variant="h4"
            style={{ color: "white" }}
            fontWeight={"bold"}
          >
            You are not a player of that game!
          </Typography>
        </Box>
        <Box mt={"2em"}>
          <StyledButton
            variant="outlined"
            onClick={() => {
              router.push("/")
            }}
          >
            Return To Home
          </StyledButton>
        </Box>
      </Box>
    </Box>
  )
}

export default NotMemberOfGameErrorPage
