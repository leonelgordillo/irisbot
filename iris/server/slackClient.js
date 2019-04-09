'use strict'

const { RTMClient } = require('@slack/rtm-api');
// An access token (from your Slack app or custom integration - usually xoxb)

class SlackClient {

    /*
module.exports.init = function slackClient(token, logLevel, nlpClient, serviceRegistry) {
    rtm = new RTMClient(token, logLevel);
    nlp = nlpClient;
    registry = serviceRegistry;
    addAuthenticatedHandler(rtm, handleOnAuthenticated)
    rtm.on('message', handleOnMessage);
    return rtm;
}

    */

    constructor(token, logLevel, nlp, registry) {
        this._rtm = new RTMClient(token, { logLevel: logLevel });
        this._nlp = nlp;
        this._registry = registry;

        this._addAuthenticatedHandler(this._handleOnAuthenticated);
        this._rtm.on('message', this._handleOnMessage.bind(this));
    }

    _handleOnAuthenticated(rtmStartData) {
        console.log(`Logged in as ${rtmStartData.self.name} or team ${rtmStartData.team.name}, but not yet connected to the channel`)
    }

    _addAuthenticatedHandler(handler) {
        this._rtm.on('authenticated', handler.bind(this));
    }

    _handleOnMessage(message) {
        if (message.text.toLowerCase().includes('iris')) {
            this._nlp.ask(message.text, (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(res);
                try {
                    console.log(res.intent);
                    if (!res.intent || !res.intent[0] || !res.intent[0].value) {
                        throw new Error('Could not extract intent.');
                    }

                    const intent = require('./intents/' + res.intent[0].value + 'Intent');

                    intent.process(res, this._registry, (error, response) => {
                        if (error) {
                            console.log(error.message);
                            return;
                        }

                        return this._rtm.sendMessage(response, message.channel);
                    });

                } catch (err) {
                    console.log(err);
                    console.log(res);
                    this._rtm.sendMessage('Sorry, I don\'t know what you are talking about!', message.channel);
                }
            });
        }
    }
    start(handler) {
        this._addAuthenticatedHandler(handler);
        this._rtm.start();
    }

}

module.exports = SlackClient;



// The client is initialized and then started to get an active connection to the platform


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