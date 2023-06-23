const { App, LogLevel } = require('@slack/bolt');


// Initialize some messy env variables
const SignalWireBASE64 =process.env.SignalWireBASE64;
const SignalWireSPACE = process.env.SignalWireSPACE;
const url = 'https://'+ SignalWireSPACE + '/api/video/conferences';
const find_token_url = 'https://' + SignalWireSPACE + '/api/video/conferences/'
const auth = 'Basic '+ SignalWireBASE64;

// Initializes your slack app with your bot token and signing secret
const app = new App({
  token: process.env.SlackBotToken,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: 'true',
    port: process.env.PORT || 3000
});

// Begin app
(async () => {
  // Start your app
  await app.start( process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

// Use room name from slash command to create a video conference from sw API
const CreateRoom = async  (room) => {
    const axios = require('axios');
    let data = JSON.stringify({
        "name": room,
        "display_name": room
    });
    let config = {
        method: 'post',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': auth,
        },
        data : data
    };
    axios(config)
        .then((response) => {
            console.log('This is response data');
            console.log(JSON.stringify(response.data));
            const conferenceID = response.data.id;

            // Use conference ID that was obtained from create a conference API to list find conference Token
            FindConferenceToken (conferenceID)
        })
        .catch((error) => {
            console.log(error);
        });
}

// Use conference ID to find the conference token using sw endpoint for retreive a conference
const FindConferenceToken = async  (conferenceID) => {
    const axios = require('axios');
    let config = {
        method: 'get',
        url: find_token_url + conferenceID + '/conference_tokens',
        headers: {
            'Accept': 'application/json',
            'Authorization': auth
        }
    };
    axios(config)
        .then((response) => {
            const res = response
             const modToken = res.data.data[0].token;
             console.log("This is the moderator token" + modToken);

             //toDO Send the modToken to update url of button
             DisplayModal(modToken)
        })
        .catch((error) => {
            console.log(error);
        });
}
// Use list conferences api to find conference token


const DisplayModal = async  (conferenceToken) => {

}

app.command('/signalwire', async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();
    //await respond(`${command.text}`);
    console.log(command.text);
    room = await CreateRoom(command.text);
  await respond(
          {
              "type": "modal",
              "title": {
                  "type": "plain_text",
                  "text": "SignalWire",
                  "emoji": true
              },
              "close": {
                  "type": "plain_text",
                  "text": "Cancel",
                  "emoji": true
              },
              "blocks": [
                  {
                      "type": "header",
                      "text": {
                          "type": "plain_text",
                          "text": "Join Video Conference: " + command.text,
                          "emoji": true
                      }
                  },
                  {
                      "type": "actions",
                      "elements": [
                          {
                              "type": "button",
                              "text": {
                                  "type": "plain_text",
                                  "emoji": true,
                                  "text": "Join"
                              },
                              // ToDo: fix URl
                              "url": "https://" + SignalWireSPACE + "/prebuilt-room/" + conferenceToken,
                              "style": "primary",
                              "value": "click_me_123"
                          }
                      ]
                  }
              ]
});
});