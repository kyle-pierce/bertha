const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const request = require('request')
const cheerio = require('cheerio')
const app = express()

const token = process.env.FB_VERIFY_TOKEN
const access = process.env.FB_ACCESS_TOKEN

app.set('port', (process.env.PORT || 5000))


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.get('/', function(req, res) {
  res.send('Hello World!')
})

function scrapeSite(site) {
  app.get('/scrape', function(req, res) {

    url = site;

    if (!error) {
      var $ = cheerio.load(html);

      var name, number, desc;
      var json = { name : "", number : "", desc : ""}

    }

  })

}

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;

app.get('/webhook/', function(req, res) {
  if (req.query['hub.verify_token'] === token) {
      res.send(req.query['hub.challenge'])
    }
  res.send('No entry')
})

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {
    sendTextMessage(senderID, messageTest);

  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: access },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}

app.listen(app.get('port'), function() {
  console.log(' running on port', app.get('port'))
})
