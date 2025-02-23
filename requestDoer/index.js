import express from "express";
import axios from "axios";
import fs from "fs";
import Groq from "groq-sdk";
import { get } from "http";

const app = express();
const PORT = process.env.PORT || 3000;
const groq = new Groq({
  apiKey: "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",
});

app.use(express.json());

async function getMarketResearchPrompt(marketDescription) {
  const systemPrompt = fs
    .readFileSync("./groqPromptSystemPrompt.txt", "utf-8")
    .replace("{{MARKET_DESCRIPTION}}", marketDescription);
  const firstMessage = fs
    .readFileSync("./groqPromptFirstMessage.txt", "utf-8")
    .replace("{{MARKET_DESCRIPTION}}", marketDescription);

  const systemResponse = await groq.chat.completions.create({
    messages: [{ role: "system", content: systemPrompt }],
    model: "llama-3.3-70b-versatile",
  });
  const userResponse = await groq.chat.completions.create({
    messages: [{ role: "user", content: firstMessage }],
    model: "llama-3.3-70b-versatile",
  });

  const rawSystemMessage = systemResponse.choices[0]?.message?.content || "";
  const rawUserMessage = userResponse.choices[0]?.message?.content || "";

  return [rawSystemMessage, rawUserMessage];
}

app.get("/", (req, res) => {
  res.send("Welcome to the Axios and Express App!");
});

// Example route to fetch data using axios
app.get("/api/data", async (req, res) => {
  try {
    const { market } = req.body;
    const phoneNumbers = fs
      .readFileSync("./numbers.txt", "utf-8")
      .trim()
      .split("\n");

    //const response = await axios.get("https://api.example.com/data");
    const [rawSystemMessage, rawUserMessage] = await getMarketResearchPrompt(
      market
    );
    try {
      console.log(phoneNumbers);
      for (const number of phoneNumbers) {
        const body = JSON.stringify({
          prompt: `${rawSystemMessage}`,
          first_message: `${rawUserMessage}`,
          number: `${number}`,
        });

        const headers = {
          "Content-Type": "application/json",
        };
        console.log(body);
        const endpoint =
          "https://zebra-amused-whale.ngrok-free.app/outbound-call";

        // Await the response for each number before proceeding to the next
        const response = await axios.post(endpoint, body, { headers });
        console.log(`Response for ${number}:`, response.data);
      }
      return res.status(200).json({ message: "we lit" });
    } catch (error) {
      console.error(`Error calling :`, error);
      return res
        .status(500)
        .json({ message: "interal server error", error: error });
    }
  } catch (error) {
    res.status(500).send("Error fetching data");
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
