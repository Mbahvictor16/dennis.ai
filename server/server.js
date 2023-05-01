const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const configuration = new Configuration({
  organization: "org-egUd1Ev1Pl5y872SQcVw8GM8",
  apiKey: process.env.OPEN_AI,
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from DennisAi",
  });
});

app.post("/", async (req, res) => {
  try {
    const result = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${req.body.prompt}`,
      temperature: 0,
      max_tokens: 2000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot_response: result.data.choices[0].text,
    });
  } catch (error) {
    res.status(500).send({
      err_message: error,
    });
  }
});

app.listen(5000, () => {
  console.log("The server is running");
});
