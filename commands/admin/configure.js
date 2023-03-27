const { Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const suggestionChannelsGet = require('../../subcommands/configure/suggestion-channels/get');
const suggestionChannelsAdd = require('../../subcommands/configure/suggestion-channels/add');
const suggestionChannelsRemove = require('../../subcommands/configure/suggestion-channels/remove');
const helpForum = require('../../subcommands/configure/help-forum');

module.exports = {
  /**
   *
   * @param {{ interaction: Interaction }} param0
   */
  run: async ({ interaction, client }) => {
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    switch (subcommandGroup) {
      case 'suggestion-channels':
        switch (subcommand) {
          case 'get':
            await suggestionChannelsGet(interaction, client);
            break;

          case 'add':
            await suggestionChannelsAdd(interaction, client);
            break;

          case 'remove':
            await suggestionChannelsRemove(interaction, client);
            break;
        }
        break;

      case 'help-forum':
        await helpForum(interaction, client);
        break;
    }
  },

  // Command structure
  data: {
    name: 'configure',
    description: 'Update my configuration.',
    options: [
      {
        name: 'suggestion-channels',
        description: 'Configure suggestion channels.',
        type: 2,
        options: [
          // /configure suggestion-channels get
          {
            name: 'get',
            description: 'Get a list of all suggestion channels.',
            type: 1,
          },

          // /configure suggestion-channels add <channel>
          {
            name: 'add',
            description: 'Add a suggestion channel.',
            type: 1,
            options: [
              {
                name: 'channel',
                description: 'The channel to add.',
                type: ApplicationCommandOptionType.Channel,
                required: true,
              },
            ],
          },

          // /configure suggestion-channels remove <channel>
          {
            name: 'remove',
            description: 'Remove a suggestion channel.',
            type: 1,
            options: [
              {
                name: 'channel',
                description: 'The channel to remove.',
                type: ApplicationCommandOptionType.Channel,
                required: true,
              },
            ],
          },
        ],
      },

      // /configure help-forum <channel>
      {
        name: 'help-forum',
        description: 'Set help forum.',
        type: 1,
        options: [
          {
            name: 'channel',
            description: 'The channel to set as the help channel.',
            type: ApplicationCommandOptionType.Channel,
            required: true,
          },
        ],
      },
    ],
  },

  guildOnly: true,
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
