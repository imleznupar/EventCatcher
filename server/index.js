import dotenv from "dotenv";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
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
const schema = {
  description: "List of events",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      eventTitle: {
        type: SchemaType.STRING,
        nullable: false,
      },
      locationTitle: {
        type: SchemaType.STRING,
        nullable: false,
      },
      startYear: {
        type: SchemaType.INTEGER,
        nullable: false,
      },
      startMonth: {
        type: SchemaType.INTEGER,
        nullable: false,
      },
      startDay: {
        type: SchemaType.INTEGER,
        nullable: false,
      },
      startHour: {
        type: SchemaType.INTEGER,
        nullable: false,
      },
      startMinute: {
        type: SchemaType.INTEGER,
        nullable: false,
      },
      endYear: {
        type: SchemaType.INTEGER,
        nullable: false,
      },
      endMonth: {
        type: SchemaType.INTEGER,
        nullable: false,
      },
      endDay: {
        type: SchemaType.INTEGER,
        nullable: false,
      },
      endHour: {
        type: SchemaType.INTEGER,
        nullable: false,
      },
      endMinute: {
        type: SchemaType.INTEGER,
        nullable: false,
      },
    },
    required: ["eventTitle", "startYear", "startMonth", "startDay", "startHour", "startMinute", "endYear", "endMonth", "endDay", "endHour", "endMinute"],
  },
};
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  }
});

async function run(prompt) {
  const result = await model.generateContent(prompt);
  return (result.response.text());
}

// setup app
app.get("/", async function (req, res) {
  try {
    const prompt = decodeURIComponent(req.headers['email-content']) + "\n\ngenerate the list of events in the email above. if none, return empty list.";
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
