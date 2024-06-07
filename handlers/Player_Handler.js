const player = require("./player");
const ee = require("../settings/embed.json");
const emoji = require("../settings/emoji.json");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Client,
  ButtonInteraction,
} = require("discord.js");
const chalk = require("chalk");

const status = (queue) =>
  `Volume: ${queue.volume}% • Filter: ${
    queue.filters.join(", ") || "Off"
  } • Status : ${queue.paused ? "Paused" : "Playing"} • Loop: ${
    queue.repeatMode ? (queue.repeatMode === 2 ? "Queue" : "Song") : "Off"
  } • Autoplay: ${queue.autoplay ? "On" : "Off"}`;

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  await player.setMaxListeners(25);
  try {
    // play song
    player.on("playSong", async (queue, song) => {
      if (!queue) return;
      client.updateplaymsg(queue);
      client.updatequeuemsg(queue);
      let data = await client.music.get(queue.textChannel.guild.id);
      if (queue.textChannel.id === data.channel) return;
      queue.textChannel
        .send({
          embeds: [
            new MessageEmbed()
              .setColor(ee.color)
              .setThumbnail(song.thumbnail)
              .setDescription(`>>> ** [\`${song.name}\`](${song.url}) **`)
              .addFields([
                {
                  name: `${emoji.song_by} Requested By`,
                  value: `>>> ${song.user}`,
                  inline: true,
                },
                {
                  name: `${emoji.time} Duration`,
                  value: `>>> \`${song.formattedDuration}\``,
                  inline: true,
                },
              ])
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
          components: [client.buttons],
        })
        .then((msg) => {
          client.temp2.set(queue.textChannel.guild.id, msg.id);
        });
    });

    // add song
    player.on("addSong", async (queue, song) => {
      if (!queue) return;
      client.updatequeuemsg(queue);
      let data = await client.music.get(queue.textChannel.guild.id);
      if (queue.textChannel.id === data.channel) return;
      queue.textChannel
        .send({
          embeds: [
            new MessageEmbed()
              .setColor(ee.color)
              .setAuthor({
                name: `Added to Queue`,
                iconURL: song.user.displayAvatarURL({ dynamic: true }),
                url: song.url,
              })
              .setDescription(`>>> ** [\`${song.name}\`](${song.url}) **`)
              .addFields([
                {
                  name: `${emoji.song_by} Requested By`,
                  value: `>>> ${song.user}`,
                  inline: true,
                },
                {
                  name: `${emoji.time} Duration`,
                  value: `>>> \`${song.formattedDuration}\``,
                  inline: true,
                },
              ])
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch((e) => {});
          }, 5000);
        })
        .catch((e) => {});
    });

    // add list
    player.on("addList", async (queue, playlist) => {
      if (!queue) return;
      client.updatequeuemsg(queue);
      let data = await client.music.get(queue.textChannel.guild.id);
      if (queue.textChannel.id === data.channel) return;
      queue.textChannel
        .send({
          embeds: [
            new MessageEmbed()
              .setColor(ee.color)
              .setAuthor({
                name: `Playlist Added to Queue`,
                iconURL: playlist.user.displayAvatarURL({ dynamic: true }),
                url: playlist.url,
              })
              .setDescription(
                `>>> ** [\`${playlist.name}\`](${playlist.url}) **`
              )
              .addFields([
                {
                  name: `${emoji.song_by} Requested By`,
                  value: `>>> ${playlist.user}`,
                  inline: true,
                },
                {
                  name: `${emoji.time} Duration`,
                  value: `>>> \`${playlist.formattedDuration}\``,
                  inline: true,
                },
                {
                  name: `${emoji.lyrics} Songs`,
                  value: `>>> \`${playlist.songs.length} Songs\``,
                  inline: true,
                },
              ])
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch((e) => {});
          }, 5000);
        })
        .catch((e) => {});
    });
    // disconnect
    player.on("disconnect", async (queue) => {
      if (!queue) return;
      client.updatemusic(queue.textChannel.guild);
      let data = await client.music.get(queue.textChannel.guild.id);
      if (queue.textChannel.id === data.channel) return;
      let ID = client.temp2.get(queue.textChannel.guild.id);
      let playembed;
      try {
        playembed = await queue.textChannel.messages.fetch(ID, {
          cache: true,
          force: true,
        });
      } catch (error) {
        console.error("Error fetching playembed:", error);
        return;
      }
      if (playembed && typeof playembed.edit === "function") {
        playembed.edit({ components: [client.buttons2] }).catch((e) => {
          console.error("Error editing playembed:", e);
        });
      } else {
        console.error("playembed or edit method not found.");
      }
      queue.textChannel.send({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setDescription(
              `_ ${emoji.ERROR} Someone Disconnected me From Voice Channel _`
            )
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      });
    });
    // finish song
    player.on("finishSong", async (queue, song) => {
      if (!queue) return;
      let data = await client.music.get(queue.textChannel.guild.id);
      if (queue.textChannel.id === data.channel) return;
      let ID = client.temp2.get(queue.textChannel.guild.id);
      let playembed = await queue.textChannel.messages.fetch(ID, {
        cache: true,
        force: true,
      });
      if (playembed) {
        playembed.edit({ components: [client.buttons2] }).catch((e) => {});
      }
      queue.textChannel
        .send({
          embeds: [
            new MessageEmbed()
              .setColor(ee.color)
              .setDescription(`_ [\`${song.name}\`](${song.url}) Ended Now  _`)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch((e) => {});
          }, 10000);
        })
        .catch((e) => {});
    });
    // error
    player    .on("error", async (channel, error) => {
      let channel1 = client.music.get(channel.guild.id, "channel");
      if (channel.id === channel1) return;
      let ID = client.temp2.get(channel.guild.id);
      let playembed = await channel.messages
        .fetch(ID, {
          cache: true,
          force: true,
        })
        .catch((e) => {});
      if (playembed) {
        playembed.edit({ components: [client.buttons2] }).catch((e) => {});
      }
      channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setTitle(`Found a Error...`)
            .setDescription(chalk.red(String(error).substr(0, 3000)))
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      });
    });
    // no related
    player.on("noRelated", async (queue) => {
      if (!queue) return;
      client.updatemusic(queue.textChannel.guild);
      let data = await client.music.get(queue.textChannel.guild.id);
      if (queue.textChannel.id === data.channel) return;
      queue.textChannel.send({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setTitle(`No Related Song Found for \`${queue.songs[0].name}\``)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      });
    });
    // finish queue
    player.on("finish", async (queue) => {
      if (!queue) return;
      client.updatemusic(queue.textChannel.guild);
      let data = await client.music.get(queue.textChannel.guild.id);
      if (queue.textChannel.id === data.channel) return;
      let ID = client.temp2.get(queue.textChannel.guild.id);
      let playembed = await queue.textChannel.messages.fetch(ID, {
        cache: true,
        force: true,
      });
      if (playembed) {
        playembed.edit({ components: [client.buttons2] }).catch((e) => {});
      }
      queue.textChannel.send({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setDescription(
              `Queue has ended! No more music to play...\nEnjoying music with me? Consider inviting people to [The Royal Fruits Discord Server!](https://discord.gg/pear)`
            )
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      });
    });
    // init queue
    player.on("initQueue", async (queue) => {
      (queue.volume = 90), (queue.autoplay = false);
    });
  } catch (e) {
    console.log(chalk.red(e));
  }

  // interaction handling
  try {
    client.on("interactionCreate", async (interaction) => {
      if (!interaction.guild || interaction.user.bot) return;
      if (interaction.isButton()) {
        await interaction.deferUpdate().catch((e) => {});
        const { customId, member, guild } = interaction;
        let voiceMember = interaction.guild.members.cache.get(member.id);
        let channel = voiceMember.voice.channel;
        let queue = await player.getQueue(interaction.guild.id);
        switch (customId) {
          case "playp":
            {
              if (!channel) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.me.voice.channel &&
                !interaction.guild.me.voice.channel.equals(channel)
              ) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
                );
              } else if (!queue || !queue.previousSongs.length) {
                send(
                  interaction,
                  `** ${emoji.ERROR} No Previous Song Found **`
                );
              } else {
                await queue.previous().catch((e) => {});
                send(
                  interaction,
                  `** ${emoji.previous_track} Playing Previous Song.**.`
                );
              }
            }
            break;
          case "skip":
            {
              if (!channel) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.me.voice.channel &&
                !interaction.guild.me.voice.channel.equals(channel)
              ) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
                );
              } else if (!queue) {
                send(interaction, `** 🎧 Nothing Playing **`);
              } else if (queue.songs.length === 1) {
                queue.stop().catch((e) => {});
                send(interaction, `** ${emoji.skip_track} Song Skiped !!**.`);
              } else {
                await queue.skip().catch((e) => {});
                send(interaction, `** ${emoji.skip_track} Song Skiped !!**.`);
              }
            }
            break;
          case "stop":
            {
              if (!channel) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.me.voice.channel &&
                !interaction.guild.me.voice.channel.equals(channel)
              ) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
                );
              } else if (!queue) {
                send(interaction, `** 🎧 Nothing Playing **`);
              } else {
                await queue.stop().catch((e) => {});
                send(interaction, `** ${emoji.stop} Song Stopped !!**.`);
              }
            }
            break;
          case "pause":
            {
              if (!channel) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.me.voice.channel &&
                !interaction.guild.me.voice.channel.equals(channel)
              ) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
                );
              } else if (!queue) {
                send(interaction, `** 🎧 Nothing Playing **`);
              } else if (queue.paused) {
                await queue.resume();
                client.buttons.components[1] = new MessageButton()
                  .setCustomId("pause")
                  .setStyle("SECONDARY")
                  .setLabel("Pause")
                  .setEmoji(emoji.pause);
                let ID =
                  client.temp.get(queue.textChannel.guild.id) ||
                  client.temp2.get(queue.textChannel.guild.id);
                let playembed = await queue.textChannel.messages
                  .fetch(ID, {
                    cache: true,
                    force: true,
                  })
                  .catch((e) => {});

                playembed
                  .edit({ components: [client.buttons] })
                  .catch((e) => {});

                send(interaction, `** ${emoji.resume} Song Resumed !! **`);
              } else if (!queue.paused) {
                await queue.pause();
                client.buttons.components[1] = new MessageButton()
                  .setCustomId("pause")
                  .setStyle("SECONDARY")
                  .setLabel("Resume")
                  .setEmoji(emoji.resume);
                               let ID =
                  client.temp.get(queue.textChannel.guild.id) ||
                  client.temp2.get(queue.textChannel.guild.id);
                let playembed = await queue.textChannel.messages
                  .fetch(ID, {
                    cache: true,
                    force: true,
                  })
                  .catch((e) => {});

                playembed
                  .edit({ components: [client.buttons] })
                  .catch((e) => {});

                send(interaction, `** ${emoji.pause} Song Paused !! **`);
              }
            }
            break;
          case "loop":
            {
              if (!channel) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.me.voice.channel &&
                !interaction.guild.me.voice.channel.equals(channel)
              ) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
                );
              } else if (!queue) {
                send(interaction, `** 🎧 Nothing Playing **`);
              } else if (queue.loopMode === 1) {
                await queue.setLoopMode(0);
                send(interaction, `** ${emoji.single}  Queue Looping is off**`);
              } else if (queue.loopMode === 0) {
                await queue.setLoopMode(1);
                send(interaction, `** ${emoji.loop}  Queue Looping is on**`);
              }
            }
            break;
          case "autoreplay":
            {
              if (!channel) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.me.voice.channel &&
                !interaction.guild.me.voice.channel.equals(channel)
              ) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
                );
              } else if (!queue) {
                send(interaction, `** 🎧 Nothing Playing **`);
              } else if (queue.autoplay) {
                await queue.setAutoplay(false);
                send(
                  interaction,
                  `** ${emoji.autoreplay}  Autoplay is off**`
                );
              } else if (!queue.autoplay) {
                await queue.setAutoplay(true);
                send(interaction, `** ${emoji.autoreplay}  Autoplay is on**`);
              }
            }
            break;
          case "shuffle":
            {
              if (!channel) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.me.voice.channel &&
                !interaction.guild.me.voice.channel.equals(channel)
              ) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
                );
              } else if (!queue) {
                send(interaction, `** 🎧 Nothing Playing **`);
              } else {
                await queue.shuffle().catch((e) => {});
                send(interaction, `** ${emoji.shuffle} Queue shuffled**`);
              }
            }
            break;
          case "remove":
            {
              if (!channel) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.me.voice.channel &&
                !interaction.guild.me.voice.channel.equals(channel)
              ) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
                );
              } else if (!queue) {
                send(interaction, `** 🎧 Nothing Playing **`);
              } else {
                let song = queue.songs[0];
                let remove = await queue.remove(0);
                if (remove)
                  send(
                    interaction,
                    `** ${emoji.remove_queue} Removed \`${song.name}\` from Queue**`
                  );
              }
            }
            break;
        }
      }
    });
  } catch (e) {
    console.log(String(e.stack).red);
  }
};
