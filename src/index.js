require('dotenv').config();
const mongoose = require('mongoose');
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.MessageContent,
  ],
});

(async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(process.env.MONGODB_URI).catch((e) => {
     throw new Error(`Error connecting to DB: ${e}`);
  });

  eventHandler(client);
  client.login(process.env.TOKEN);
})();
