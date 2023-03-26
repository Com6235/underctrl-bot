require('dotenv/config');
const { Client } = require('discord.js');
const { CommandHandler } = require('djs-commander');
const { testServer } = require('./config.json');
const mongoose = require('mongoose');
const path = require('path');

const client = new Client({ intents: 131071 });

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to database');
});

new CommandHandler({
  client,
  commandsPath: path.join(__dirname, 'commands'),
  eventsPath: path.join(__dirname, 'events'),
  validationsPath: path.join(__dirname, 'validations'),
  testServer,
});

const token =
  process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_TOKEN
    : process.env.DEVELOPMENT_TOKEN;

client.login(token);
