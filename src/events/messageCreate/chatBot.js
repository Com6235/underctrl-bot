const { Client, Message } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const { chatBotChannel } = require('../../../config.json');

/**
 *
 * @param { Client } client
 * @param { Message } message
 * @returns
 */

module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (message.channel.id !== chatBotChannel) return;
  if (message.content.startsWith('!')) return;

  await message.channel.sendTyping();

  if (message.content.length > 300) {
    message.reply("Whoa now, I'm not going to read all that. Maybe summarize?");
    return;
  }

  const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  let prevMessages = await message.channel.messages.fetch({ limit: 25 });
  prevMessages = prevMessages.sort((a, b) => a - b);

  let conversationLog = '';

  prevMessages.forEach((msg) => {
    if (msg.author.id === message.author.id || msg.author.id === client.user.id) {
      if (!msg.content.startsWith('!')) {
        conversationLog += `${msg.author.username}: ${msg.content}\n`;
      }
    }
  });

  const result = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${client.user.username} is a friendly chatbot. It was created by Avraj by making use of OpenAI's Davinci Model.

             ${client.user.username}: Hello, how can I help you?
             ${conversationLog}
             ${client.user.username}: 
             `,
    max_tokens: 256,
  });

  if (result.data.choices[0].finish_reason === 'length') {
    message.reply(result.data.choices[0].text + '...*it costs a lot for me to speak more than this.*');
  } else {
    message.reply(result.data.choices[0].text);
  }
};
