const { Interaction, ChannelType, PermissionFlagsBits } = require('discord.js');
const GuildConfig = require('../models/GuildConfig');

module.exports = {
  /**
   *
   * @param {{ interaction: Interaction }} param0
   */
  run: async ({ interaction }) => {
    try {
      if (interaction.channel.type !== ChannelType.PublicThread) {
        interaction.reply({
          content: 'Channel type needs to be a public thread.',
          ephemeral: true,
        });
        return;
      }

      await interaction.deferReply();

      const guildConfig = await GuildConfig.findOne({ id: interaction.guildId }).select(
        'modules helpForums modRoles helperRoles'
      );

      const helpForumsModule = guildConfig.modules.find((module) => module.name === 'help-forums');

      if (!helpForumsModule) {
        await interaction.editReply(
          'The `help-forums` module has been disabled in this server.\nEnable it using `/module enable help-forums`'
        );
        return;
      }

      const forumChannelExistsinDb = guildConfig.helpForums?.find(
        (forum) => forum.id === interaction.channel.parentId
      );

      if (!forumChannelExistsinDb) {
        await interaction.editReply(
          "You can't run this command in this forum channel as it isn't part of help forums list.\nRun `/configure help-forums add <forum-channel>` to add this to the list of help forums."
        );
        return;
      }

      let starterMessage = await interaction.channel.fetchStarterMessage().catch(() => null);

      let threadOwner;

      if (starterMessage) {
        threadOwner = starterMessage.author;
      }

      const isModOrHelper = interaction.member.roles.cache.some(
        (role) =>
          guildConfig.modRoles.includes(role.id) || guildConfig.helperRoles.includes(role.id)
      );

      if (
        !isModOrHelper &&
        !interaction.member.permissions.has(PermissionFlagsBits.ManageChannels) &&
        interaction.member.id !== threadOwner?.id
      ) {
        await interaction.editReply("You don't have enough permissions to close this thread.");
        return;
      }

      const solvedTagId = forumChannelExistsinDb.solvedTagId;

      if (solvedTagId) {
        if (interaction.channel.appliedTags?.includes(solvedTagId)) {
          await interaction.editReply(
            ':ballot_box_with_check: This thread has been archived again as it had previously been marked as solved.'
          );
          await interaction.channel.setArchived(true);
          return;
        }

        await interaction.channel
          .setAppliedTags([...interaction.channel.appliedTags, solvedTagId])
          .catch((e) => console.log(e));
      }

      const messageAmount = interaction.channel.messageCount;

      await interaction.editReply(
        `:white_check_mark: ${
          threadOwner ? threadOwner : ''
        } Marked thread as closed after ${messageAmount} messages.`
      );
      await interaction.channel.setArchived(true);
    } catch (error) {
      console.log(error);
    }
  },

  // <---- COMMAND INFO ---->
  data: {
    name: 'solved',
    description: 'Mark thread as solved.',
  },
  guildOnly: true,
};
