const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const app = express();
require("dotenv").config();

const cors = require("cors");

app.use(cors());

app.use(express.json());

const configuration = new Configuration({
  organization: process.env.ORGANIZATION,
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateQuizQuestions(text, numOfQuestions) {
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "assistant",
            content: `You have to generate ${numOfQuestions} questions from ${text}.`
          }
        ]
      });
  
      return response.data;
    } catch (error) {
      console.error('Error in generating quiz questions:', error);
      throw error;
    }
  }

app.post("/generate-quiz", async (req, res) => {
    const { text, numOfQuestions } = req.body;
  
    try {
      const quizQuestions = await generateQuizQuestions(text, numOfQuestions);
      res.json({ questions: quizQuestions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error generating quiz questions" });
    }
  });