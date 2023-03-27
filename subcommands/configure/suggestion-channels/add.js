const { Interaction } = require('discord.js');
const createGuildConfig = require('../../../utils/createGuildConfig');
const Config = require('../../../models/GuildConfig');

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

    if (!guildConfig.modules?.suggestions) {
      await interaction.editReply('The suggestions module has been disabled for this server.');
      return;
    }

    const targetChannel = interaction.options.getChannel('channel');

    if (guildConfig.suggestionChannels.includes(targetChannel.id)) {
      await interaction.editReply(
        'This channel already exists in the list of suggestion channels.'
      );
      return;
    }

    guildConfig.suggestionChannels.push(targetChannel.id);

    await guildConfig.save().catch(async (e) => {
      await interaction.editReply(`There was an error adding this suggestions channel.\n${e}`);
      return;
    });

    await interaction.editReply(`Channel ${targetChannel} has been set as a suggestions channel.`);
    return;
  } catch (error) {
    console.log(error);
  }
};
