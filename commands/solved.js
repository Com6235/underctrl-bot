const { ChannelType, PermissionFlagsBits } = require('discord.js');
const { solvedTagId, emojis, helperRoleId } = require('../config.json');
const checkEmoji = emojis.checkEmoji;

module.exports = {
  run: async ({ interaction }) => {
    try {
      if (!(interaction.channel.type === ChannelType.PublicThread)) {
        interaction.reply({
          content: 'Channel type needs to be a public thread.',
          ephemeral: true,
        });
        return;
      }

      await interaction.deferReply();

      let threadOwner;
      let starterMessage;

      starterMessage = await interaction.channel.fetchStarterMessage().catch(() => null);

      if (starterMessage) {
        threadOwner = starterMessage.author;
      }

      if (
        interaction.member.permissions.has(PermissionFlagsBits.ManageChannels) ||
        interaction.member.id === threadOwner?.id ||
        interaction.member.roles.cache.has((r) => r.id === helperRoleId)
      ) {
        if (interaction.channel.appliedTags?.includes(solvedTagId)) {
          await interaction.editReply(
            'This thread has been archived again as it had previously been marked as solved.'
          );
          await interaction.channel.setArchived(true);
          return;
        }

        await interaction.channel.setAppliedTags([...interaction.channel.appliedTags, solvedTagId]);
        const messageAmount = interaction.channel.messageCount;

        await interaction.editReply(
          `${checkEmoji} ${
            threadOwner ? `${threadOwner}` : ''
          } Marked thread as solved after ${messageAmount} messages.`
        );
        await interaction.channel.setArchived(true);
      } else {
        interaction.editReply('Not enough permissions.');
      }
    } catch (error) {
      console.log(`Error executing /solved: ${error}`);
    }
  },

  // <---- COMMAND INFO ---->
  data: {
    name: 'solved',
    description: 'Mark thread as solved.',
  },
  botPermissions: [PermissionFlagsBits.ManageChannels],
};
