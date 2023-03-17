const { Interaction } = require('discord.js');

/**
 * @param {Interaction} interaction
 */
module.exports = (interaction, commandObj) => {
  // User permissions
  if (commandObj.permissionsRequired?.length) {
    for (const permission of commandObj.permissionsRequired) {
      if (!interaction.member.permissions.has(permission)) {
        interaction.reply({
          content: "You don't enough permissions to run this command.",
          ephemeral: true,
        });

        return true;
      }
    }
  }

  // Bot permissions
  if (commandObj.botPermissions?.length) {
    const bot = interaction.guild.members.me;

    for (const permission of commandObj.botPermissions) {
      if (!bot.permissions.has(permission)) {
        interaction.reply({
          content: "I don't have enough permissions to execute this action.",
          ephemeral: true,
        });

        return true;
      }
    }
  }
};
