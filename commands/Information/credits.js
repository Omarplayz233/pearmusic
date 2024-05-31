const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");

module.exports = new Command({
  // options
  name: "credits",
  description: "Display credits for the bot and its creators.",
  userPermissions: ["SEND_MESSAGES"],
  botPermissions: ["SEND_MESSAGES"],
  category: "Information",
  cooldown: 10,
  // command start
  run: async ({ client, interaction, args, prefix }) => {
    // Code for the main page
    const mainPageEmbed = new MessageEmbed()
      .setColor("#77dd77") // Light green color
      .setTitle("Bot Credits")
      .setDescription("This bot and my other friend <@1133116470952480871> was created by ***'omarplayz.'*** and ***appletiergod***.")
      .addField("PearMusic Developed by:", "***'omarplayz.'***")
      .addField(
        "Special Thanks to:",
        "***ramboni, appletiergod, kingdom_of_nambiadia, piggy_guy221, cursed_guy, arenhatesmac, krut.t, mighty_fahl 'dad ofc', oatchi123, noumisocool and _jay_123 (Frank)*** (for more, go to the 2nd page)."
      )
      .setFooter(
        "Thank you to all who helped me build this bot and we appreciate you supporting us by thanking us."
      )
      .setThumbnail(client.user.displayAvatarURL());

    // Create a separate embed for the 2nd page and modify it as needed
    const secondPageEmbed = new MessageEmbed()
      .setColor("#77dd77") // Light red color for the 2nd page
      .setTitle("Bot Credits (2nd Page)")
      .addField("Payment by:", "***royalpearyt***")
      .addField("Organisation by:", "***appletiergod***")
      .addField("Special Thanks To:", "***kurāi 暗い#9166, toadmemer, BigBootyBrazilian#0603, sircynda, CocoButter and goldenanimation_***")
      .setFooter("Thank you to all who helped me build this bot and we appreciate you supporting us by thanking us.")
      .setThumbnail(client.user.displayAvatarURL());

    // Create the buttons for navigation
    const secondPageButton = new MessageButton()
      .setCustomId("second_page")
      .setLabel("Go to 2nd Page")
      .setStyle("PRIMARY");

    const mainPageButton = new MessageButton()
      .setCustomId("main_page")
      .setLabel("Back to Main Page")
      .setStyle("PRIMARY");

    // Create a row to add the buttons
    const row = new MessageActionRow().addComponents(secondPageButton);

    // Send the initial message with the main page content and the button to go to the 2nd page
    const initialMessage = await interaction.followUp({ embeds: [mainPageEmbed], components: [row] });

    // Set up an event listener to handle button interactions
    client.on("interactionCreate", async (buttonInteraction) => {
      if (!buttonInteraction.isButton()) return;

      // Check if the button is for going to the 2nd page and if the original message ID exists
      if (buttonInteraction.customId === "second_page" && buttonInteraction.message.id === initialMessage.id) {
        // Remove the previous button and replace it with the button to go back to the main page
        row.components = [mainPageButton];
        buttonInteraction.message.edit({ embeds: [secondPageEmbed], components: [row] });
      } else if (buttonInteraction.customId === "main_page" && buttonInteraction.message.id === initialMessage.id) {
        // Remove the previous button and replace it with the button to go to the 2nd page
        row.components = [secondPageButton];
        buttonInteraction.message.edit({ embeds: [mainPageEmbed], components: [row] });
      }
    });
  },
});
