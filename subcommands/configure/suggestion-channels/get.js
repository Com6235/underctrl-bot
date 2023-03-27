const { Interaction, EmbedBuilder } = require('discord.js');
const createGuildConfig = require('../../../utils/createGuildConfig');
const Config = require('../../../models/GuildConfig');

/**
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

    if (!guildConfig.suggestionChannels?.length) {
      await interaction.editReply('No suggestion channels have been set... yet.\nRun `/configure suggestion-channels add` to add one.');
      return;
    }

    let channels = '';
    guildConfig.suggestionChannels.forEach((channel, index) => {
      channels += `${index + 1}. <#${channel.id}> ID: ${channel.id}\n`;
    });

    const channelsEmbed = new EmbedBuilder({
      title: 'Suggestion channels',
      description: `${channels}\nTo remove a channel run \`/configure suggestion-channels remove <channel_id>\``,
      timestamp: Date.now(),
    });

    await interaction.editReply({ embeds: [channelsEmbed] });
  } catch (error) {
    console.log(error);
  }
};
