const { Configuration, OpenAIApi } = require('openai');

module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (message.channel.id !== '1063031078174081064') return;

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
    model: 'text-ada-001',
    prompt: message.content,
    max_tokens: 20,
  });

  if (result.data.choices[0].finish_reason === 'length') {
    message.reply(
      result.data.choices[0].text +
        "... (had to stop so Under Ctrl doesn't end up broke.)"
    );
  } else {
    message.reply(result.data.choices[0].text);
  }
};
