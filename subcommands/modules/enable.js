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

    const moduleToEnable = interaction.options.getString('module');

    const moduleFound = guildConfig.modules.find((mod) => mod.name === moduleToEnable);

    if (moduleFound) {
      if (moduleFound.enabled) {
        await interaction.editReply('This module has already been enabled.');
        return;
      } else {
        moduleFound.enabled = true;
      }
    } else {
      guildConfig.modules.push({ name: moduleToEnable, enabled: true });
    }

    await guildConfig.save().catch(async (e) => {
      await interaction.editReply(`There was an error: ${e}`);
      return;
    });

    await interaction.editReply(`Enabled module \`${moduleToEnable}\``);
  } catch (error) {
    console.log(error);
  }
};
