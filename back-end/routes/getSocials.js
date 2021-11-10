const express = require("express");
const needle = require("needle");
const axios = require("axios");
const router = express.Router();
const database = require("../data");
const { crypto } = require("./getNews");
const { cryptoNews, socials } = database;
const fs = require("fs");
const keyword_extractor = require("keyword-extractor");

router.get("/:media/:id", (req, res) => {
  let coin = req.params.id;
  let social = req.params.media;
  let index = undefined;
  let asset = undefined;

  if (coin === undefined) {
    res.status(404).json({
      message: "Page not found",
    });
  }
  if (social === undefined) {
    res.status(404).json({
      message: "Page not found",
    });
  }

  //Represent if the coin was found in the list of coins
  coin = coin.toUpperCase();
  asset = socials[coin];
  if (asset === undefined) {
    res.status(404).json({
      message: `INVALID POST REQUEST, coin ${coin} NOT FOUND.`,
    });
  } else {
    //If no social media
    social = social.toLowerCase();
    if (social.toLowerCase() === "twitter") {
      if (asset.tweets.length === 0) {
        const tweets = async () => {
          const endpoint = "https://api.twitter.com/2/tweets/search/recent";
          const isSucces = await getTweets(endpoint, coin, asset.name);
          if (isSucces === true) {
            res.status(200).json(socials[coin].tweets);
          } else {
            res.status(500).json({
              message: "Could not get data from API",
            });
          }
        };
        tweets();
      } else {
        res.status(200).json(asset.tweets);
      }
    } else if (social === "facebook") {
      if (asset.fb.length === 0) {
        if (cryptoNews.length !== 0) {
          asset.fb = database.cryptoNews;
          res.status(200).json(asset.fb);
        } else {
          const fb = async () => {
            const isSucces = await crypto();
            if (isSucces === true) {
              asset.fb = database.cryptoNews;
              res.status(200).json(asset.fb);
            }
          };
          fb();
        }
      } else {
        res.status(200).json(asset.fb);
      }
    } else {
      res.status(404).json({
        message: `Page not found`,
      });
    }
  }
});

// //Get FB news
// const getFB = async () => {
//   let isSuccess = false;
//   isSuccess = await getCryptoNews();
//   console.log("Issucces", isSuccess);
//   return isSuccess;
// };

//Get Tweets
const getTweets = async (endpoint, shortForm, coin) => {
  const token = process.env.TWITTER_BEARER_TOKEN;
  const query = `(#${coin} OR #${shortForm}) lang:en -is:retweet -is:reply is:verified`;
  let isSucces = false;

  const params = {
    query: query,
    "user.fields": "name,username",
    "tweet.fields": "author_id,lang",
    max_results: 100,
    expansions: "author_id",
  };

  const res = await needle("get", endpoint, params, {
    headers: {
      "User-Agent": "v2RecentSearchJS",
      authorization: `Bearer ${token}`,
    },
  });

  if (res.body) {
    const map = new Map();
    const allTweets = res.body.data;
    let users = res.body.includes.users;

    //Put posters in a map
    for (let i = 0; i < users.length; ++i) {
      let user = users[i];
      map.set(user.id, [user.name, user.username]);
    }

    //Go through tweets and posters to them
    for (let i = 0; i < allTweets.length; ++i) {
      let tweet = allTweets[i];
      let idx = tweet.text.indexOf("https://t.co/");
      let url = "";
      if (idx !== -1) {
        while (
          idx < tweet.text.length &&
          tweet.text[idx] !== " " &&
          tweet.text[idx] !== "\n"
        ) {
          url += tweet.text[idx];
          ++idx;
        }
      }

      const author = tweet.author_id;
      if (map.has(author)) {
        authorDetails = map.get(author);
        socials[shortForm].tweets.push({
          name: authorDetails[0],
          username: authorDetails[1],
          tweet: tweet.text,
          url: url,
        });
      } else {
        socials[shortForm].tweets.push({
          name: tweet.author_id,
          username: tweet.author_id,
          tweet: tweet.text,
          url: url,
        });
      }
    }
    try {
      //  Extract the keywords

      const stringData = JSON.stringify(
        socials[shortForm].tweets.map((data) => data.tweet + " "),
      ).replace(/[^a-zA-Z ]/g, "");
      const extraction_result = keyword_extractor.extract(stringData, {
        language: "english",
        remove_digits: true,
        remove_duplicates: false,
      });

      fs.writeFile(
        `./public/socials/${shortForm}.json`,
        '["' + extraction_result.join(" ").substring(0, 1500) + '"]',
        (err) => {
          if (err) console.log(err);
          else {
            console.log("Succesful Writing.");
          }
        },
      );
    } catch (err) {
      console.log("STRINGIFY FAILED FOR NEW DATA.");
    }

    isSucces = true;
  } else {
    console.log("Unsuccesful request");
  }
  return isSucces;
};

module.exports = router;
