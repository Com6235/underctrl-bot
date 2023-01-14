const { Configuration, OpenAIApi } = require('openai');
const { chatBotChannel } = require('../../../config.json');

module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (message.channel.id !== chatBotChannel) return;

  message.channel.sendTyping();

  if (message.content.length > 300) {
    message.reply("Whoa now, I'm not going to read all that. Maybe summarize?");
    return;
  }

  const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const result = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: message.content,
    max_tokens: 300,
  });

  if (result.data.choices[0].finish_reason === 'length') {
    message.reply(
      result.data.choices[0].text +
        '... (it costs Under Ctrl much more for longer responses.)'
    );
  } else {
    message.reply(result.data.choices[0].text);
  }
};
