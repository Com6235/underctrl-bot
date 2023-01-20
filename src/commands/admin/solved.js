const { Client, Interaction, PermissionFlagsBits, ChannelType } = require('discord.js');

const { solvedTagId } = require('../../../config.json');
const { checkEmoji } = require('../../../emojis.json');

module.exports = {
  name: 'solved',
  description: 'Mark question as solved.',
  botPermissions: [PermissionFlagsBits.ManageChannels],

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    if (!(interaction.channel.type === ChannelType.PublicThread)) {
      interaction.reply({
        content: 'Channel type needs to be a public thread.',
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    const starterMessage = await interaction.channel.fetchStarterMessage();
    const threadOwner = starterMessage?.author;

    if (interaction.member.permissions.has(PermissionFlagsBits.ManageChannels) || interaction.member.id === threadOwner.id) {
      if (interaction.channel.appliedTags?.includes(solvedTagId)) {
        interaction.editReply('This thread is already marked as solved.');
        return;
      }

      try {
        await interaction.channel.setAppliedTags([...interaction.channel.appliedTags, solvedTagId]);

        const messageAmount = interaction.channel.messageCount;

        await interaction.editReply(`${checkEmoji} ${threadOwner ? `${threadOwner}` : ''} Marked thread as solved after ${messageAmount} messages.`);

        await interaction.channel.setArchived(true);
      } catch (error) {
        console.log(`There was an error marking this thread as solved. ${error}`);
      }
    } else {
      interaction.editReply('Not enough permissions.');
    }
  },
};
