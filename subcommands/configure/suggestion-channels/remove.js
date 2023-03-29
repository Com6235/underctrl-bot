const { Interaction } = require('discord.js');
const GuildConfig = require('../../../models/GuildConfig');
const createGuildConfig = require('../../../utils/createGuildConfig');

/**
 *
 * @param {Interaction} interaction
 */
module.exports = async (interaction) => {
  try {
    await interaction.deferReply({ ephemeral: true });

    let guildConfig = await GuildConfig.findOne({ id: interaction.guildId });

    if (!guildConfig) {
      guildConfig = createGuildConfig(interaction.guildId);
    }

    const targetChannelId = interaction.options.getString('channel-id');

    const channelIndex = guildConfig.suggestionChannels.findIndex(
      (channel) => channel.id === targetChannelId
    );

    if (channelIndex === -1) {
      await interaction.editReply(
        `Channel <#${targetChannelId}> is not in the list of suggestion channels.`
      );
      return;
    }

    guildConfig.suggestionChannels.splice(channelIndex, 1);

    await guildConfig.save().catch(async (e) => {
      await interaction.editReply(`There was an error removing this suggestion channel.\n${e}`);
      return;
    });

    await interaction.editReply(
      `Channel <#${targetChannelId}> has been removed from the list of suggestion channels.`
    );
  } catch (error) {
    console.log(error);
  }
};
