const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");

module.exports = new Command({
  // options
  name: "socialmedia",
  description: "Social Media From RoyalPearYT",
  userPermissions: ["SEND_MESSAGES"],
  botPermissions: ["SEND_MESSAGES"],
  category: "Information",
  cooldown: 10,
  // command start
  run: async ({ client, interaction, args, prefix }) => {
    // Create the embed
    const creditsEmbed = new MessageEmbed()
      .setColor("#77dd77") // Light green color
      .setTitle("Pear's Socials")
      .setDescription(
        "These are Pear's ONLY public socials, do not trust **anyone that send you links** except for <#1002403434663784508>, <#1097772051755966534> and <#1097769254679486494>\n\n" +
        "Remember to follow RoyalPear on all of his socials!"
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter(
        "These are RoyalPear's ONLY Public Social Medias. Please do not follow any social media accounts that pretend to be RoyalPear which aren't on this list. Every Social Media on this list was officially announced by Pear in his discord server.",
        client.user.displayAvatarURL()
      );

    // Create the buttons
    let button_youtubepear = new MessageButton()
      .setStyle("LINK")
      .setLabel("Youtube")
      .setURL("https://youtube.com/@RoyalPear")
      .setEmoji("1134516360693682276");
    let button_youtubevod = new MessageButton()
      .setStyle("LINK")
      .setLabel("RoyalPear Vod YT")
      .setURL("https://www.youtube.com/@PearVODs")
      .setEmoji("1134516360693682276")
    let button_twitch = new MessageButton()
      .setStyle("LINK")
      .setLabel("Twitch")
      .setURL("https://twitch.tv/royalpearyt")
      .setEmoji("1134518285057142784")
    let button_tiktok = new MessageButton()
      .setStyle("LINK")
      .setLabel("TikTok")
      .setURL("https://tiktok.com/@pearofroyalty")
      .setEmoji("1134516443082403921")
    let button_twitter = new MessageButton()
      .setStyle("LINK")
      .setLabel("Twitter")
      .setURL("https://twitter.com/alexrpear")
      .setEmoji("1134518799727595591")
    let button_x = new MessageButton()
      .setStyle("LINK")
      .setLabel("X (known as Twitter in Elon way)")
      .setURL("https://twitter.com/alexrpear")
      .setEmoji("1134529793501696070")
    let button_patreon = new MessageButton()
      .setStyle("LINK")
      .setLabel("Patreon (pls sub)")
      .setURL("https://patreon.com/royalpear")
      .setEmoji("1134518569502257242")
    let button_discord = new MessageButton()
      .setStyle("LINK")
      .setLabel("Discord (pls invite)")
      .setURL("https://discord.gg/pear")
      .setEmoji("1134520983710077070")
    let button_youtubejoin = new MessageButton()
      .setStyle("LINK")
      .setLabel("Join")
      .setURL("https://youtube.com/@RoyalPear/join")
      .setEmoji("1134516360693682276")
    let button_editor = new MessageButton()
      .setStyle("LINK")
      .setLabel("Editor's yt")
      .setURL("https://youtube.com/@Sensei_aep")
      .setEmoji("1134516360693682276")
    let button_saveroyalmelon = new MessageButton()
      .setStyle("LINK")
      .setLabel("Save RoyalMelon (clone of royalpear)")
      .setURL("https://youtube.com/@CloneRoyalPear")
      .setEmoji("1134516360693682276")

    const buttonsRow1 = new MessageActionRow().addComponents(
      button_youtubepear,
      button_youtubevod,
      button_twitch,
      button_tiktok
    );

    const buttonsRow2 = new MessageActionRow().addComponents(
      button_twitter,
      button_x,
      button_discord
    );
    const buttonsRow3 = new MessageActionRow().addComponents(
      button_patreon,
      button_youtubejoin,
      button_editor,
      button_saveroyalmelon
    );
    interaction.followUp({
      embeds: [creditsEmbed],
      components: [buttonsRow1, buttonsRow2, buttonsRow3], // Added buttonsRow3 to the components
    });
  },
});
