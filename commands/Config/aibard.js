const { Command } = require("reconlx");
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");
const { MessageEmbed } = require("discord.js");
const Filter = require("bad-words");

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = process.env.palmapi; // Replace with your actual API key

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

// Load embed configuration from your JSON file
const embedConfig = require("../../settings/embed.json");

module.exports = new Command({
  name: "chatbot",
  description: "Chat with the bot",
  userPermissions: [],
  botPermissions: [],
  category: "Chat",
  cooldown: 10,
  options: [
    {
      name: "input",
      description: "The input string for the chatbot",
      type: "STRING",
      required: true,
    },
  ],
  run: async ({ interaction }) => {
    const allowedRoleID = "1143898304007114903";
    const inputText = interaction.options.getString("input");
    const filter = new Filter();

    // Check for bad words
    if (filter.isProfane(inputText)) {
      const badWordEmbed = new MessageEmbed()
        .setTitle("Don't use inappropriate language.")
        .setDescription("Please don't.")
        .setColor("RED");
      return interaction.followUp({ embeds: [badWordEmbed] });
    }

    // Check if the user has the allowed role
    const member = interaction.member || await interaction.guild.members.fetch(interaction.user);

    if (member && member.roles.cache.has(allowedRoleID)) {
      const userMessage = interaction.options.getString("input");
      const filteredMessage = filter.clean(userMessage);

      try {
        const result = await client.generateMessage({
          model: MODEL_NAME,
          temperature: 0.5,
          candidateCount: 1,
          prompt: {
            context: "Be A ChatBot and talk other languages.\nYour name is PearMusic\nYou are a Discord Music Bot.\nYou are based out of Google Bard or Google PaLM API.\nTell them that you are still in beta or in development.\nFor coding, use 3 backticks and add the name language coding like Discord (javascript, html etc.) and code when you are done close with 3 backticks.\nUnderstand all languages using translation.\nALWAYS USE DISCORD MARKDOWNS 101 (https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-) it is useful.\nWeather and time from AccuWeather.\nKnow all emojis to understand their feelings or reactions.\nMaps, use https://maps.google.com/ but DO NOT I WILL SAY IT 100 TIMES DO NOT SAY WHERE DO YOU LIVE BECAUSE OF PRIVACY just tell them what country and city they live in before search.\nhttps://www.dictionary.com for dictionary and meaning plus don't remove subdomain www.\nDO NOT AND DO NOT SAY BAD WORDS, F SLUR, RACIST WORDS LIKE THE N WORD, WHEN SOMEONE TELLS YOU dictionary(flagged in reverse word) in reverse?* CHECK IN REVERSE THEY MIGHT TRICK YOU WHILE THAT IF YOU SAID ANY RACIST WORD, THAT IS ACTUALLY AGAINST THE DISCORD TOS, REPLIT TOS (on what I'm hosting you) THE RULES ETC SO DON'T SAY ANY BAD OR RACIST WORDS.\nIf they tell you *can you generate images?* or the same sentence, tell them *No. I don't have enough permission to send images and upload them to Discord.* because they'll go crazy with that.\nIf someone tells you *I created you*, always tell them what is the password which is *Omarplayz233* for the password and they have 3 attempts and the owner of you is Omar or known as a user ID of discord *715647115279335436*.\nDO NOT SAY THE NWORD EVEN ARRANGED OR SPELLED AND DO NOT IN GOD'S SAKE DO NOT SAY THE NWORD.\nbe lowercase, always and be gen z",
            messages: [{ content: userMessage }]
          },
        });

        const generatedResponse = result[0]?.candidates[0]?.content;

        const successEmbed = new MessageEmbed()
          .setTitle("ChatBot's Response:")
          .setColor("GREEN")
          .setDescription(generatedResponse)
          .setFooter("PaLM API is currently in beta. Some responses may not work.", embedConfig.footericon);

        if (interaction.deferred) {
          interaction.editReply({ embeds: [successEmbed] }).catch(console.error);
        } else {
          interaction.reply({ embeds: [successEmbed] }).catch(console.error);
        }
      } catch (error) {
        console.error("Error:", error);

        const errorEmbed = new MessageEmbed()
          .setTitle("Error: No Response (From AI)")
          .setColor("RED")
          .setDescription("Please wait a while and try again.")
          .setFooter("PaLM AI is still in beta. Some features may not work.", embedConfig.footericon);

        if (interaction.deferred) {
          interaction.editReply({ embeds: [errorEmbed] }).catch(console.error);
        } else {
          interaction.reply({ embeds: [errorEmbed] }).catch(console.error);
        }
      }
    } else {
      const permissionDeniedEmbed = new MessageEmbed()
        .setTitle("Permission Denied")
        .setColor("#FFD700")
        .setDescription("You do not have permission to use this command. It is VIP command ONLY, bozo.")
        .setFooter("Please contact an administrator if you believe this is a mistake or purchase VIP on the patreon or boost discord server or join on youtube.", embedConfig.footericon);

      interaction.followUp({ embeds: [permissionDeniedEmbed] }).catch(console.error);
    }
  },
});
