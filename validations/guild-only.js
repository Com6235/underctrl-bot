const { Interaction } = require('discord.js');

/**
 *
 * @param {Interaction} interaction
 */
module.exports = (interaction, commandObj) => {
  if (commandObj.guildOnly && !interaction.inGuild()) {
    interaction.reply({
      content: 'This command must be executed inside a server.',
      ephemeral: true,
    });
    return true;
  }
};
