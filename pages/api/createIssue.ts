import type { NextApiRequest, NextApiResponse } from "next"

interface IssueData {
  title: string
  description: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { title, description } = req.body as IssueData
    const githubResponse = await fetch(
      "https://api.github.com/repos/khalidh223/fake-artist/issues",
      {
        method: "POST",
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          title: title,
          body: description,
        }),
      }
    )

    if (!githubResponse.ok) {
      return res.status(500).json({ message: "Error creating GitHub issue" })
    }

    const issue = await githubResponse.json()
    return res
      .status(200)
      .json({
        success: true,
        message: "Issue created successfully",
        issueUrl: issue.html_url,
      })
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end("Method Not Allowed")
  }
}
