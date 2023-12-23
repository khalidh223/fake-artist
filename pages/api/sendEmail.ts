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

    if (feedbackType === "comment") {
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp-mail.outlook.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.OUTLOOK_EMAIL,
            pass: process.env.OUTLOOK_PASSWORD,
          },
          tls: {
            ciphers: "SSLv3",
          },
        })

        const mailOptions = {
          from: process.env.OUTLOOK_EMAIL,
          to: "khalidhussain4656@gmail.com",
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
