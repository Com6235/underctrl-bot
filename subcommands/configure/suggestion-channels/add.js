const { Interaction, ChannelType } = require('discord.js');
const createGuildConfig = require('../../../utils/createGuildConfig');
const Config = require('../../../models/GuildConfig');

// Regular expression for a valid hex color code
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

/**
 *
 * @param {Interaction} interaction
 */
module.exports = async (interaction) => {
  try {
    await interaction.deferReply({ ephemeral: true });

    let guildConfig = await Config.findOne({ id: interaction.guildId });

    if (!guildConfig) {
      guildConfig = await createGuildConfig(interaction.guildId);
    }

    const suggestionsModuleEnabled = guildConfig.modules.find((mod) => mod.name === 'suggestions')?.enabled;

    if (!suggestionsModuleEnabled) {
      await interaction.editReply('The suggestions module has been disabled for this server.\nRun `/module enable suggestions` to enable it.');
      return;
    }

    const targetChannel = interaction.options.getChannel('channel');
    let embedColor = interaction.options.getString('embed-color');
    const upvoteReaction = interaction.options.getString('upvote-reaction');
    const downvoteReaction = interaction.options.getString('downvote-reaction');

    const channelExists = guildConfig.suggestionChannels.find((channel) => channel.id === targetChannel.id);

    if (channelExists) {
      await interaction.editReply(`Channel ${targetChannel} already exists in the list of suggestion channels.`);
      return;
    }

    if (targetChannel.type !== ChannelType.GuildText) {
      await interaction.editReply('You can only set server text channels as suggestion channels.');
      return;
    }

    if (!hexColorRegex.test(embedColor)) {
      await interaction.editReply('Invalid embed color code. Please use a valid hex color code.');
      return;
    }

    embedColor = parseInt(embedColor.replace('#', ''), 16);
    console.log(embedColor);

    guildConfig.suggestionChannels.push({
      id: targetChannel.id,
      embedColor,
      upvoteReaction,
      downvoteReaction,
    });

    await guildConfig.save().catch(async (e) => {
      await interaction.editReply(`There was an error adding this suggestions channel.\n${e}`);
      return;
    });

    await interaction.editReply(`Channel ${targetChannel} has been set as a suggestion channel.`);
  } catch (error) {
    console.log(error);
  }
};
