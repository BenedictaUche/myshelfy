const express = require("express");
const cors = require("cors");
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.static("public"));

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
