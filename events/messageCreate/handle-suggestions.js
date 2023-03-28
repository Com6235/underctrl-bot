const { Message, EmbedBuilder } = require('discord.js');
const GuildConfig = require('../../models/GuildConfig');
const createGuildConfig = require('../../utils/createGuildConfig');

/**
 *
 * @param { Message } message
 */
module.exports = async (message) => {
  try {
    if (message.author.bot || message.content.startsWith('!')) return;

    let guildConfig = await GuildConfig.findOne({ id: message.guildId }).select('suggestionChannels');

    if (!guildConfig) {
      guildConfig = await createGuildConfig(message.guildId);
    }

    const suggestionChannel = guildConfig.suggestionChannels.find((channel) => channel.id === message.channelId);

    if (!suggestionChannel) return;

    const embed = new EmbedBuilder({
      author: { name: message.author.tag, iconURL: message.author.displayAvatarURL() },
      description: message.content,
      ...(suggestionChannel.embedColor && { color: suggestionChannel.embedColor }),
    });

    await message.delete();

    const reply = await message.channel.send({ embeds: [embed] });

    await reply.react(suggestionChannel.upvoteReaction || '👍');
    await reply.react(suggestionChannel.downvoteReaction || '👎');
  } catch (error) {
    console.log(error);
  }
};
