const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require('discord.js');
const canvacord = require('canvacord');
const Level = require('../../models/Level');
const getCurrentLevelXp = require('../../utils/getCurrentLevelXp');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply('You can only run this command inside a server.');
      return;
    }

    await interaction.deferReply();

    const mentionedUserId = interaction.options.get('target-user')?.value;
    const targetUserId = mentionedUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(
      mentionedUserId || interaction.member.id
    );

    const fetchedLevel = await Level.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });

    if (!fetchedLevel) {
      interaction.editReply(
        mentionedUserId
          ? `${targetUserObj.user.tag} doesn't have any levels yet. Try again when they chat a little more.`
          : "You don't have any levels yet. Chat a little more and try again."
      );
      return;
    }

    const currentLevelXp = getCurrentLevelXp(fetchedLevel.level);

    // setup user rank
    let allLevels = await Level.find({ guildId: interaction.guild.id }).select('userId level xp');
    allLevels = allLevels.sort((a, b) => (b.level > a.level ? 1 : -1));
    allLevels = allLevels.sort((a, b) => (b.xp > a.xp ? 1 : -1));

    let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

    // send level card
    const rank = new canvacord.Rank()
      .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
      .setRank(currentRank)
      .setLevel(fetchedLevel.level)
      .setCurrentXP(fetchedLevel.xp)
      .setRequiredXP(currentLevelXp)
      .setStatus(targetUserObj.presence.status)
      .setProgressBar('#FFFFFF', 'COLOR')
      .setUsername(targetUserObj.user.username)
      .setDiscriminator(targetUserObj.user.discriminator);

    const data = await rank.build();
    const attachment = new AttachmentBuilder(data);
    interaction.editReply({ files: [attachment] });
  },

  name: 'level',
  description: "Get yours/someone's level.",
  options: [
    {
      name: 'target-user',
      description: 'The user whose level you want to see.',
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
};
