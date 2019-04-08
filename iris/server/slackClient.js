'use strict'

const { RTMClient } = require('@slack/rtm-api');
const CLIENT_EVENTS = require('@slack/events-api');
// An access token (from your Slack app or custom integration - usually xoxb)

let rtm = null;
let nlp = null;
let registry = null;

function handleOnAuthenticated(rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} or team ${rtmStartData.team.name}, but not yet connected to the channel`)
}

function handleOnMessage(message) {

    if (message.text.toLowerCase().includes('iris')) {
        nlp.ask(message.text, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(res);
            try {
                console.log(res.intent);
                if(!res.intent || !res.intent[0] || !res.intent[0].value){
                    throw new Error("Could not extract intent.");
                }

                const intent = require('./intents/' + res.intent[0].value + "Intent");

                intent.process(res, registry, function(error, response){
                    if(error){
                        console.log(error.message);
                        return;
                    }

                    return rtm.sendMessage(response, message.channel);
                });
            } catch(err){
                console.log(err);
                console.log(res);
                rtm.sendMessage("Sorry, I don't know what you are talking about!", message.channel);
            }
        });
    }
}

function addAuthenticatedHandler(rtm, handler) {
    rtm.on('authenticated', handler);
}

// The client is initialized and then started to get an active connection to the platform
module.exports.init = function slackClient(token, logLevel, nlpClient, serviceRegistry) {
    rtm = new RTMClient(token, logLevel);
    nlp = nlpClient;
    registry = serviceRegistry;
    addAuthenticatedHandler(rtm, handleOnAuthenticated)
    rtm.on('message', handleOnMessage);
    return rtm;
}


module.exports.addAuthenticatedHandler = addAuthenticatedHandler;

// Calling `rtm.on(eventName, eventHandler)` allows you to handle events (see: https://api.slack.com/events)
// When the connection is active, the 'ready' event will be triggered
// rtm.on('ready', async () => {

//   // Sending a message requires a channel ID, a DM ID, an MPDM ID, or a group ID
//   // The following value is used as an example
//   const conversationId = 'C1232456';

//   // The RTM client can send simple string messages
//   const res = await rtm.sendMessage('Hello there', conversationId);

//   // `res` contains information about the sent message
//   console.log('Message sent: ', res.ts);
// });

// // After the connection is open, your app will start receiving other events.
// rtm.on('user_typing', (event) => {
//   // The argument is the event as shown in the reference docs.
//   // For example, https://api.slack.com/events/user_typing
//   console.log(event);
// })