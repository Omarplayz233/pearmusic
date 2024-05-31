process.on("multipleResolves", (type, promise, reason) => {
  if (reason.toLocaleString() === "Error: Cannot perform IP discovery - socket closed") return;
});

require('dotenv').config();

const express = require('express');
const pingmonitor = require('ping-monitor');
const DisTube = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

const app = express();
const { exec } = require('child_process');

exec('node -v', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing command: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`Error output: ${stderr}`);
    return;
  }

  console.log(`Node.js version: ${stdout}`);
});

app.get('/', (req, res) => { res.send('yay it is working!') });

app.listen(3000, () => { console.log('server started'); });

const { Client, Collection, Intents } = require("discord.js");
const fs = require("fs");
const client = new Client({
  messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  shards: "auto",
  allowedMentions: {
    parse: ["roles", "users", "everyone"],
    repliedUser: true,
  },
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});
module.exports = client;

const config = require("./settings/config.json");

// Global Variables
client.events = new Collection();
client.cooldowns = new Collection();
client.subcmd = new Collection();
client.commands = new Collection();
client.temp = new Map();
client.temp2 = new Map();
client.categories = fs.readdirSync("./commands/");

// Initializing the project
//Loading files, with the client variable like Command Handler, Event Handler, ...
["event_handler", "slash_handler", "Player_Handler"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

// Database connection
const Enmap = require("enmap");
client.settings = new Enmap({
  name: "settings",
  dataDir: "./Database/Settings",
});
client.music = new Enmap({
  name: "music",
  dataDir: "./Database/Music",
});

client.login(process.env.token || config.token);

process.on("unhandledRejection", (reason, p) => {
  console.log(" [Error_Handling] :: Unhandled Rejection/Catch");
  console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log(" [Error_Handling] :: Uncaught Exception/Catch");
  console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(" [Error_Handling] :: Uncaught Exception/Catch (MONITOR)");
  console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
  console.log(" [Error_Handling] :: Multiple Resolves");
  console.log(type, promise, reason);
});
