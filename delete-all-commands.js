require('dotenv/config');
const { REST, Routes } = require('discord.js');

const guildId = '1055188344188973066'; // If you want to delete guild-base commands, set this to the guild id.
const clientId = '1086188233035100191'; // Set this to your BOT id.
const token = process.env.TOKEN; // Make sure variable "TOKEN" is set in .env

const rest = new REST().setToken(token);

if (!clientId) {
  throw new Error('clientId must be set for application commands to be deleted.');
}

(async () => {
  try {
    if (guildId) {
      console.log('⏳ Deleting guild commands.');

      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
    }

    console.log('⏳ Deleting global commands.');

    await rest.put(Routes.applicationCommands(clientId), { body: [] });

    console.log('✅ Successfully deleted all commands.');
  } catch (error) {
    console.log(`Error => ${error}`);
  }
})();
