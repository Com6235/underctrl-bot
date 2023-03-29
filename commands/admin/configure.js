const { Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const suggestionChannelsGet = require('../../subcommands/configure/suggestion-channels/get');
const suggestionChannelsAdd = require('../../subcommands/configure/suggestion-channels/add');
const suggestionChannelsRemove = require('../../subcommands/configure/suggestion-channels/remove');
const helpForumsAdd = require('../../subcommands/configure/help-forums/add');
const helpForumsRemove = require('../../subcommands/configure/help-forums/remove');

module.exports = {
  /**
   *
   * @param {{ interaction: Interaction }} param0
   */
  run: async ({ interaction, client }) => {
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    switch (subcommandGroup) {
      // subcommandGroup "suggestion-channels"
      // /configure suggestion-channels
      case 'suggestion-channels':
        switch (subcommand) {
          // /configure suggestion-channels get
          case 'get':
            await suggestionChannelsGet(interaction);
            break;

          // /configure suggestion-channels add
          case 'add':
            await suggestionChannelsAdd(interaction);
            break;

          // /configure suggestion-channels remove
          case 'remove':
            await suggestionChannelsRemove(interaction);
            break;
        }

      // subcommandGroup "help-forums"
      // /configure help-forums
      case 'help-forums':
        switch (subcommand) {
          // /configure help-forums add
          case 'add':
            await helpForumsAdd(interaction);
            break;

          // /configure help-forums remove
          case 'remove':
            await helpForumsRemove(interaction);
            break;
        }
    }
  },

  // Command structure
  data: {
    name: 'configure',
    description: 'Configure bot settings.',
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
              {
                name: 'embed-color',
                description: 'The color you want suggestion embeds to be.',
                type: ApplicationCommandOptionType.String,
              },
              {
                name: 'upvote-reaction',
                description: 'The reaction emoji you want the suggestion to get.',
                type: ApplicationCommandOptionType.String,
              },
              {
                name: 'downvote-reaction',
                description: 'The reaction emoji you want the suggestion to get.',
                type: ApplicationCommandOptionType.String,
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
                name: 'channel-id',
                description: 'The ID of the channel to remove.',
                type: ApplicationCommandOptionType.String,
                required: true,
              },
            ],
          },
        ],
      },

      // /configure help-forum <channel>
      {
        name: 'help-forums',
        description: 'Configure help forum settings.',
        type: 2,
        options: [
          // /configure help-forums add <channel> [solved-tag-id]
          {
            name: 'add',
            description: 'Add a help forum channel',
            type: 1,
            options: [
              {
                name: 'channel',
                description: 'The forum channel to use as a help channel.',
                type: ApplicationCommandOptionType.Channel,
                required: true,
              },
              {
                name: 'solved-tag-id',
                description: 'The ID of the tag you want to add once a thread has been solved.',
                type: ApplicationCommandOptionType.String,
              },
            ],
          },

          // /configure help-forums remove <channel-id>
          {
            name: 'remove',
            description: 'Remove a help forum channel',
            type: 1,
            options: [
              {
                name: 'channel-id',
                description: 'The ID of the forum channel to remove.',
                type: ApplicationCommandOptionType.String,
                required: true,
              },
            ],
          },
        ],
      },
    ],
  },

  guildOnly: true,
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
