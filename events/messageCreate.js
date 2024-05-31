const { MessageEmbed } = require("discord.js");
const client = require("..");
const ee = require("../settings/embed.json");
const { databasing } = require('../handlers/functions');

// Create a map to store the reply targets and their corresponding messages
const replyTargets = new Map();

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  databasing(message.guild.id, message.member.id);
  let prefix = ".";

  // Check if the bot is mentioned in the message
  if (message.mentions.users.has(client.user.id)) {
    const botMention = message.mentions.users.first().toString();
    message.reply(`**To See My All Commands, Use The** \`/\` **Prefix And Click On** <@1133725404264415322> **for information.**`);
    return;
  }

  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift()?.toLowerCase();
    if (cmd === "rr") {
      process.exit();
      message.reply(`RESTARTING............`);
    }

    // Add your command handling logic here
    if (cmd === "talk" && (message.author.id === "756529025719074846" || message.author.id === "1156360857060638730")) { // me :3
      const textToReply = args.join(" ");
      if (!textToReply) {
        return message.reply("Please provide a message for the bot to say!");
      }

      // Store the target user and their reply in the replyTargets map
      replyTargets.set(message.author.id, { text: textToReply, channel: message.channel.id });
      message.delete().catch(console.error); // Delete the previous message
    }
  }
});

// Check if the message's author is a target for the bot's replies
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (replyTargets.has(message.author.id)) {
    // Get the reply for the user from the replyTargets map
    const { text, channel } = replyTargets.get(message.author.id);

    // Reply to the user
    client.channels.cache.get(channel).send(text);

    // Remove the user from the replyTargets map after replying
    replyTargets.delete(message.author.id);
  }
});

module.exports = client;
