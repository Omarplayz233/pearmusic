const { CommandInteraction, MessageEmbed } = require("discord.js");
const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const emoji = require("../../settings/emoji.json");
const { duration } = require(`../../handlers/functions`);

module.exports = new Command({
  // options
  name: "uptime",
  description: "Get uptime of the bot",
  userPermissions: ["SEND_MESSAGES"],
  botPermissions: ["SEND_MESSAGES"],
  category: "Information",
  cooldown: 10,
  // command start
  run: async ({ client, interaction, args, prefix }) => {
    try {
      // Code
      interaction.followUp({
        content: `\`\`\`yml\n Uptime: ${duration(client.uptime).map(t => `${t}`).join(", ")} \`\`\``
      });
    } catch (error) {
      console.error("Error while processing uptime command:", error);
      interaction.followUp({
        content: "An error occurred while processing the command. Please try again later.",
        ephemeral: true // This will make the response visible only to the user who triggered the command
      });
    }
  },
});
