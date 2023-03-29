const { Interaction, ChannelType } = require('discord.js');
const getGuildConfig = require('../../../utils/getGuildConfig');

/**
 *
 * @param {Interaction} interaction
 */
module.exports = async (interaction) => {
  try {
    await interaction.deferReply({ ephemeral: true });

    const guildConfig = await getGuildConfig(interaction.guildId);

    const helpForumsModuleEnabled = guildConfig.modules.find(
      (module) => module.name === 'help-forums'
    )?.enabled;

    if (!helpForumsModuleEnabled) {
      await interaction.editReply(
        'The help forums module has been disabled for this server.\nRun `/module enable help-forums` to enable it.'
      );
      return;
    }

    const targetForum = interaction.options.getChannel('channel');
    const solvedTagId = interaction.options.getString('solved-tag-id');

    const existingHelpForums = guildConfig.helpForums;
    const targetForumExists = existingHelpForums.find((forum) => forum.id === targetForum.id);

    if (targetForumExists) {
      await interaction.editReply(
        `Channel ${targetForum} has already been configured as a help forum.`
      );
      return;
    }

    if (targetForum.type !== ChannelType.GuildForum) {
      await interaction.editReply('You can only set forum channels as help forums.');
      return;
    }

    guildConfig.helpForums.push({
      id: targetForum.id,
      solvedTagId,
    });

    await guildConfig.save().catch(async (e) => {
      await interaction.editReply(`There was an error adding this help forum.\n${e}`);
      return;
    });

    await interaction.editReply(`Channel ${targetForum} has been set as a help forum.`);
  } catch (error) {
    console.log(error);
  }
};
