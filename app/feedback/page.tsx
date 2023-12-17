"use client"

import React, { useState, FormEvent } from "react"
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
} from "@mui/material"

interface FeedbackForm {
  feedbackType: string
  description: string
}

export default function Feedback() {
  const [feedback, setFeedback] = useState<FeedbackForm>({
    feedbackType: "",
    description: "",
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setShowSuccess(false)

    if (feedback.feedbackType === "issue") {
      try {
        const response = await fetch("/api/createIssue", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "New Issue from Feedback Form",
            description: feedback.description,
          }),
        })

        const result = await response.json()

        if (response.ok) {
          setShowSuccess(true)
          setFeedback({ feedbackType: "", description: "" }) // Reset form
        } else {
          console.error("Error creating issue: ", result.message)
        }
      } catch (error) {
        console.error("Network or other error", error)
      }
    } else {
      try {
        const response = await fetch("/api/sendEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            feedbackType: feedback.feedbackType,
            description: feedback.description,
          }),
        })

        const result = await response.json()

        if (response.ok) {
          setShowSuccess(true)
          setFeedback({ feedbackType: "", description: "" })
        } else {
          console.error("Error creating issue: ", result.message)
        }
      } catch (error) {
        console.error("Network or other error", error)
      }
    }

    setLoading(false)
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ "& > form": { maxWidth: 500 } }}
    >
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Feedback Type</InputLabel>
          <Select
            value={feedback.feedbackType}
            label="Feedback Type"
            onChange={(e) =>
              setFeedback({ ...feedback, feedbackType: e.target.value })
            }
            sx={{ backgroundColor: "#fff", color: "#000" }}
          >
            <MenuItem value="">Select...</MenuItem>
            <MenuItem value="issue">This is an issue</MenuItem>
            <MenuItem value="comment">General Comment</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Description"
          multiline
          rows={4}
          value={feedback.description}
          onChange={(e) =>
            setFeedback({ ...feedback, description: e.target.value })
          }
          fullWidth
          margin="normal"
          sx={{ backgroundColor: "#fff", color: "#000" }}
        />

        <Button
          type="submit"
          variant="outlined"
          color="primary"
          disabled={loading}
          sx={{
            mt: 2,
            color: "#F10A7E",
            borderColor: "#F10A7E",
            "&:hover": {
              borderColor: "#F10A7E",
              backgroundColor: "transparent",
            },
          }}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </Button>

        {showSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Thank you for your feedback!
          </Alert>
        )}
      </form>
    </Box>
  )
}
