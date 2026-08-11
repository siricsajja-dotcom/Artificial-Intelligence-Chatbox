const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
    try {
        const messages = req.body.messages;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                error: "Invalid messages format."
            });
        }

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful, friendly, general-purpose AI assistant."
                },
                ...messages
            ]
        });

        const reply = response.choices[0].message.content;

        res.json({
            reply: reply
        });

    } catch (error) {
        console.error("API Error:", error);

        res.status(500).json({
            error: "Something went wrong while contacting the AI."
        });
    }
});

app.listen(PORT, () => {
    console.log(`AI Chatbox running at http://localhost:${PORT}`);
});