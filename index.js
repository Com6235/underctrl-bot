require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js');
const { CommandHandler } = require('djs-commander');
const { testServer } = require('./config.json');
const mongoose = require('mongoose');
const path = require('path');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.MessageContent,
  ],
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to database');
});

new CommandHandler({
  client,
  commandsPath: path.join(__dirname, 'commands'),
  eventsPath: path.join(__dirname, 'events'),
  testServer,
});

const token =
  process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_TOKEN
    : process.env.DEVELOPMENT_TOKEN;

client.login(token);
