const GuildConfig = require('../models/GuildConfig');

module.exports = async (guildId) => {
  const guildConfig = await new GuildConfig({
    id: guildId,
  }).save();

  return guildConfig;
};
