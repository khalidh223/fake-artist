import type { NextApiRequest, NextApiResponse } from "next"
import * as natural from "natural"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { text } = req.query
  const nounInflector = new natural.NounInflector()

  if (!text || typeof text !== "string") {
    res.status(400).json({ error: "Text query parameter is required" })
    return
  }

  try {
    const response = await fetch(
      `https://thor-graphql.dictionary.com/v2/search?searchText=${text}&context=dictionary`
    )
    const data = await response.json()

    let processedData = data.data
      .map((item: any) => item.displayText)
      .filter((value: string, index: number, self: string[]) => {
        const singular = nounInflector.singularize(value)
        return self.indexOf(singular) === index
      })
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))

    if (processedData.length === 0) {
      const singular = nounInflector.singularize(text)
      processedData = [singular.charAt(0).toUpperCase() + singular.slice(1)]
    }

    res.status(200).json(processedData)
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" })
  }
}
