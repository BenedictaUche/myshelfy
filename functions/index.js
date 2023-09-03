/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.static("public"));

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

app.get("/dashboard", async (req, res) => {
  const url = req.query.url;
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const title = $("meta[property='og:title']").attr("content");
    const description = $("meta[name='description']").attr("content");
    const imageUrl = $("meta[property='og:image']").attr("content");

    if (!title || !description || !imageUrl) {
      return res.status(400).json({
        message: "Invalid URL provided",
      });
    }

    const articleData = {
      title,
      description,
      imageUrl,
    };

    return res.status(200).json(articleData);
  } catch (error) {
    return res.status(400).json({
      message: "Error while parsing the URL",
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.api = functions.https.onRequest(app);
