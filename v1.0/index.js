const express = require("express");
const Config = require("../config");
const request = require("request");
const axios = require("axios");

const router = express.Router();
const token =
  "EAAD8t3nWfNUBAJxkCAJO0cM97wS6if67ZCIQFj9NvSLWGfuBwtHIEOEVM6wHMEEnGVP6vVXmsSzXuXs8NwlvtNeUxwmjADMIuCjre5p3orim6mPz4Ax3ZBZCrlp5fveJ4ZCFNRKsFIEdUZBZBYkjFZB1GPhNS8ke57oFzX5DrZADS8hMOTDlJkPxcyslFv8GuI4ZD";

router.get("/", (req, res) => {
  res.send("Hello facebook bot");
});

// router.get("/webhook", (req, res) => {
//   console.log("rq :", req);
//   // Your verify token. Should be a random string.
//   let VERIFY_TOKEN = "facebookbotbtf";

//   // Parse the query params
//   let mode = req.query["hub.mode"];
//   let token = req.query["hub.verify_token"];
//   let challenge = req.query["hub.challenge"];

//   // Checks if a token and mode is in the query string of the request
//   if (mode && token) {
//     // Checks the mode and token sent is correct
//     if (mode === "subscribe" && token === VERIFY_TOKEN) {
//       // Responds with the challenge token from the request
//       console.log("WEBHOOK_VERIFIED");
//       res.status(200).send(challenge);
//     } else {
//       // Responds with '403 Forbidden' if verify tokens do not match
//       res.sendStatus(403);
//     }
//   }
// });

function sendTextMessage(sender, text) {
  let messageData = { text: text };

  request(
    {
      url: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: token },
      method: "POST",
      json: {
        recipient: { id: sender },
        message: messageData,
      },
    }
    // function (error, response, body) {
    //   if (error) {
    //     console.log("Error sending messages: ", error);
    //   } else if (response.body.error) {
    //     console.log("Error: ", response.body.error);
    //   }
    // }
  );
}

router.post("/webhook", async (req, res) => {
  let messaging_events = req.body.entry[0].messaging;
  for (let i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i];
    let sender = event.sender.id;
    if (event.message && event.message.text) {
      let text = event.message.text;
      if (text === "Generic") {
        console.log("welcome to chatbot");
        continue;
      }

      let data = JSON.stringify({
        query:
          "query message($message:String!){\n    message(message:$message){\n    data{\n      found\n      intent\n      confidence\n    }\n  }\n}",
        variables: { message: `${text}` },
      });

      let config = {
        method: "post",
        url: "http://103.245.164.59:3004/api_management",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          // console.log(JSON.stringify(response.data.data.message.data.intent));
          let rep = response.data.data.message.data.intent;
          console.log(sender, text);
          sendTextMessage(sender, `${rep}`);
        })
        .catch(function (error) {
          console.log("tar : ", error);
        });
    }
    // if (event.postback) {
    //   let text = JSON.stringify(event.postback);
    //   console.log("postback");
    //   // sendTextMessage(sender, "Postback received: " + text.substring(0, 200), token);
    //   continue;
    // }
  }

  res.sendStatus(200);
});

module.exports = router;
