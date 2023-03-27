const { Interaction } = require('discord.js');
const GuildConfig = require('../../models/GuildConfig');
const createGuildConfig = require('../../utils/createGuildConfig');

/**
 *
 * @param {Interaction} interaction
 */
module.exports = async (interaction) => {
  try {
    await interaction.deferReply({ ephemeral: true });

    let guildConfig = await GuildConfig.findOne({ id: interaction.guildId });

    if (!guildConfig) {
      guildConfig = await createGuildConfig(interaction.guildId);
    }

    const moduleToDisable = interaction.options.getString('module');

    const moduleFound = guildConfig.modules.find((mod) => mod.name === moduleToDisable);

    if (!moduleFound) {
      await interaction.editReply(
        `Module \`${moduleToDisable}\` has not been configured yet. Enable it using \`/modules enable ${moduleToDisable}\``
      );
      return;
    }

    if (!moduleFound.enabled) {
      await interaction.editReply('This module has already been disabled.');
      return;
    }

    moduleFound.enabled = false;

    await guildConfig.save().catch(async (e) => {
      await interaction.editReply(`There was an error: ${e}`);
      return;
    });

    await interaction.editReply(`Disabled module \`${moduleToDisable}\``);
  } catch (error) {
    console.log(error);
  }
};
