const { Interaction } = require('discord.js');
const { devs } = require('../config.json');

/**
 * @param {Interaction} interaction
 */
module.exports = (interaction, commandObj) => {
  if (commandObj.devOnly && !devs.includes(interaction.member.id)) {
    interaction.reply({
      content: 'This command is for developers only',
      ephemeral: true,
    });

    return true;
  }
};
