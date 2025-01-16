import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import express from 'express';

// config express
const app = express();
const port = 3000;

// config gemini
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run(prompt) {
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  return (result.response.text());
}

// setup app
app.get("/", async function (req, res) {
  try {
    const prompt = "how are you doing";
    const response = await run(prompt);
    res.send(response);
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).send("could not generate a response");
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
