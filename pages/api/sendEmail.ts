// pages/api/sendEmail.ts
import type { NextApiRequest, NextApiResponse } from "next"
import nodemailer from "nodemailer"

type ApiResponse = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method === "POST") {
    const { feedbackType, description } = req.body as {
      feedbackType: string
      description: string
    }

    console.log('email: ', process.env.OUTLOOK_EMAIL)
    console.log('pass: ', process.env.OUTLOOK_PASSWORD)

    if (feedbackType === "comment") {
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp-mail.outlook.com",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.OUTLOOK_EMAIL, // Your Outlook email address
            pass: process.env.OUTLOOK_PASSWORD, // Your Outlook password
          },
          tls: {
            ciphers: "SSLv3",
          },
        })

        const mailOptions = {
          from: process.env.OUTLOOK_EMAIL, // Sender address
          to: "khalidhussain4656@gmail.com", // Receiver address
          subject: "New General Comment From Fake Artist App",
          text: description,
        }

        const info = await transporter.sendMail(mailOptions)
        console.log("Email sent: " + info.response)
        res.status(200).json({ message: "Email sent successfully" })
      } catch (error) {
        console.error("Error sending email:", error)
        res.status(500).json({ message: "Error sending email" })
      }
    } else {
      res.status(400).json({ message: "Invalid feedback type" })
    }
  } else {
    res.status(405).end("Method Not Allowed")
  }
}
