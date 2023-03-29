const GuildConfig = require('../models/GuildConfig');
const createGuildConfig = require('./createGuildConfig');

/**
 *
 * @description This function fetches a guild configuration from the database or creates one if it doesn't exist.
 */
module.exports = async (guildId, limitedFields) => {
  let guildConfig = await GuildConfig.findOne({ id: guildId }).select(limitedFields);

  if (!guildConfig) {
    guildConfig = await createGuildConfig(guildId);
  }

  return guildConfig;
};
