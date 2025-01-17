import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import express from 'express';
import cors from "cors";

// config express
const app = express();
const port = 3000;

const corsOptions = {
  origin: 'https://mail.google.com',
  methods: ['GET'],
  allowedHeaders: ['email-content']
};
app.use(cors(corsOptions));

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
    const prompt = decodeURIComponent(req.headers['email-content']) + "\n\ngenerate the following content:\ntitle:\ntime (dd/mm, from when to when):\nlocation:";
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
