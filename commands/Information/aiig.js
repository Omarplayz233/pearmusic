const { Command } = require("reconlx");
const { MessageEmbed } = require("discord.js");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const axios = require("axios");
const Filter = require('bad-words');
const fs = require("fs");

module.exports = new Command({
  // options
  name: "generateimage",
  description: "Generates an image based on input.",
  userPermissions: [], // Add required user permissions
  botPermissions: [], // Add required bot permissions
  category: "ai", // Set the command category
  cooldown: 10,
  options: [
    {
      name: "prompt",
      description: "The important prompt for image generation.",
      type: "STRING",
      required: true,
    },
  ],
  // command start
  run: async ({ client, interaction, args, prefix }) => {
    // Code here
    const inputText = interaction.options.getString("prompt");
    const filter = new Filter();
    // Check for bad words
    if (filter.isProfane(inputText)) {
      const badWordEmbed = new MessageEmbed()
        .setTitle("Don't ask an innapropriate language.")
        .setDescription("Please don't.")
        .setColor("RED") // You can set any color you prefer
      return interaction.followUp({ embeds: [badWordEmbed] });
    }

    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/prompthero/openjourney-v4",
        {
          inputs: inputText,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + process.env.huggingface,
          },
          responseType: "arraybuffer",
        }
      );

      const outputPath = "./test.png";
      fs.writeFileSync(outputPath, Buffer.from(response.data));

      const embed = new MessageEmbed()
        .setTitle("Image Generation")
        .setDescription("Image generated successfully!")
        .setColor("#00ff00") // You can set any color you prefer
        .setImage('attachment://test.png');

      // Assuming you are using Discord.js v13
      await interaction.editReply({ embeds: [embed], files: [outputPath] });

      // Delete the local file after sending to Discord
      fs.unlinkSync(outputPath);
    } catch (error) {
      console.error("Error generating image:", error.message);
      interaction.followUp("Error generating image. Please try again later.");
    }
  },
});
