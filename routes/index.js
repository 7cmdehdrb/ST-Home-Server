var express = require("express");
var router = express.Router();
const path = require("path");
const GoogleAssistant = require("../index");

const config = {
    auth: {
        keyFilePath: path.resolve(__dirname, "../client_secret.json"),
        savedTokensPath: path.resolve(__dirname, "../tokens.json"), // where you want the tokens to be saved
    },
    conversation: {
        lang: "en-US", // defaults to en-US, but try other ones, it's fun!
        showDebugInfo: true, // default is false, bug good for testing AoG things
    },
    deviceModelId: "gh-connect-9183a-gh-assistant-ccyxbj", // use if you've gone through the Device Registration process
    // deviceId: 'xxxxxx', // use if you've gone through the Device Registration process
    deviceLocation: {
        coordinates: {
            // set the latitude and longitude of the device
            latitude: 37.49491006820458,
            longitude: 126.97813939020267,
        },
    },
    isNew: true, // set this to true if you want to force a new conversation and ignore the old state
    screen: {
        isOn: true, // set this to true if you want to output results to a screen
    },
};

const startConversation = (conversation) => {
    // setup the conversation
    conversation
        .on("response", (text) => console.log("Assistant Response:", text))
        .on("debug-info", (info) => console.log("Debug Info:", info))
        // if we've requested a volume level change, get the percentage of the new level
        .on("volume-percent", (percent) => console.log("New Volume Percent:", percent))
        // the device needs to complete an action
        .on("device-action", (action) => console.log("Device Action:", action))
        // once the conversation is ended, see if we need to follow up
        .on("ended", (error, continueConversation) => {
            if (error) {
                console.log("Conversation Ended Error:", error);
            } else {
                console.log("Conversation Complete");
                conversation.end();
            }
        })
        // catch any errors
        .on("error", (error) => {
            console.log("Conversation Error:", error);
        });
};

/* GET home page. */
router.get("/", function (req, res, next) {
    console.log("HELLO WORLD!");

    res.statusCode(404);
});

router.get("/call_google_assistant", (req, res, next) => {
    const { textQuery } = req.query;

    const assistant = new GoogleAssistant(config.auth);

    try {
        assistant
            .on("ready", (stream) => {
                //   console.log(stream);
                config.conversation.textQuery = textQuery;
                assistant.start(config.conversation, startConversation);
            })
            .on("error", (err) => {
                console.log(err);
            });

        res.json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
        });
    }
});

module.exports = router;
