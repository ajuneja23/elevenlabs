import express from "express";
import axios from "axios";
import fs from "fs";
import Groq from "groq-sdk";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5051;
const groq = new Groq({
  apiKey: "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",
});

app.use(express.json());
app.use(cors());

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

// Helper function to delay between calls
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Function to make a single call
async function makeOutboundCall(number, rawSystemMessage, rawUserMessage) {
  let body = {
    prompt: rawSystemMessage.replace(/\\/g, ""),
    first_message: rawUserMessage.replace(/\\/g, ""),
    number: number,
  };
  body = JSON.stringify(body);
  console.log(body);

  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const endpoint = "https://zebra-amused-whale.ngrok-free.app/outbound-call";
    const response = await axios.post(endpoint, body, { headers });
    console.log(`Successfully called ${number}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error calling ${number}:`, error);
    throw error;
  }
}

app.get("/", (req, res) => {
  res.send("Welcome to the Axios and Express App!");
});

async function getSummaries() {
  const url =
    "https://api.elevenlabs.io/v1/convai/conversations?agent_id=dx5EMYd8yhBmRdvRgTHR&page_size=4";
  const headers = {
    "xi-api-key": "sk_7b2ce7249c4cafe79723d4fe8bc35d61f55e7774143830f5",
  };
  console.log(url);
  console.log("hey hey hey hey ");
  let conv_results = [];
  try {
    const response = (await axios.get(url, { headers })).data;
    for (let conversation in response.conversations) {
      const conv_id = conversation.conversation_id;
      const conv_url = `https://api.elevenlabs.io/v1/convai/conversations/${conv_id}`;
      const conversation_obj = (await axios.get(conv_url, { headers })).data;
      conv_results.push(conversation_obj);
    }
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  } finally {
    return conv_results;
  }
}

app.post("/api/data", async (req, res) => {
  try {
    const { market } = req.body;
    const phoneNumbers = fs
      .readFileSync("./numbers.txt", "utf-8")
      .trim()
      .split("\n");

    const [rawSystemMessage, rawUserMessage] = await getMarketResearchPrompt(
      market
    );

    const results = [];
    const DELAY_BETWEEN_CALLS = 40000; // 2 seconds delay between calls

    for (const number of phoneNumbers) {
      try {
        // Make the call
        const result = await makeOutboundCall(
          number,
          rawSystemMessage,
          rawUserMessage
        );
        results.push({ number, status: "success", result });

        // Add delay before next call (except for the last number)
        if (number !== phoneNumbers[phoneNumbers.length - 1]) {
          await delay(DELAY_BETWEEN_CALLS);
        }
      } catch (error) {
        results.push({ number, status: "error", error: error.message });
        // Continue with next number even if current one fails
      }
    }

    return res.status(200).json({
      message: "Calls completed",
      results,
    });
  } catch (error) {
    console.error("Error in /api/data:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

app.get("/api/convos", async (req, res) => {
  const response = await fetch(
    "https://api.elevenlabs.io/v1/convai/conversations?agent_id=dx5EMYd8yhBmRdvRgTHR&page_size=3",
    {
      method: "GET",
      headers: {
        "xi-api-key": "sk_7b2ce7249c4cafe79723d4fe8bc35d61f55e7774143830f5",
      },
    }
  );
  const body = await response.json();
  let finalResults = [];
  let summaries = [];

  for (const conversation of body.conversations) {
    const id = conversation.conversation_id;
    const response2 = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${id}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": "sk_7b2ce7249c4cafe79723d4fe8bc35d61f55e7774143830f5",
        },
      }
    );
    const body2 = await response2.json();
    console.log(body2);
    finalResults.push({
      conversation_id: body2.conversation_id,
      summary: body2.analysis.transcript_summary,
    });
    summaries.push(body2.analysis.transcript_summary);
  }

  return res
    .status(200)
    .json({ result: finalResults, combinedSummaries: summaries });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
