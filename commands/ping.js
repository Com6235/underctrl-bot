module.exports = {
  run: ({ interaction, client }) => {
    interaction.reply(`Pong! ${client.ws.ping}ms`);
  },

  // <---- COMMAND INFO ---->
  data: {
    name: 'ping',
    description: 'Pong!',
  },
};
