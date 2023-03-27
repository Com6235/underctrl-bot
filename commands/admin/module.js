const { Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const modulesEnable = require('../../subcommands/modules/enable');
const modulesDisable = require('../../subcommands/modules/disable');

const choices = [
  {
    name: 'suggestions',
    value: 'suggestions',
  },
  {
    name: 'faq',
    value: 'faq',
  },
];

module.exports = {
  /**
   *
   * @param {{ interaction: Interaction }} param0
   */
  run: async ({ interaction }) => {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'enable':
        await modulesEnable(interaction);
        break;

      case 'disable':
        await modulesDisable(interaction);
        break;
    }
  },

  data: {
    name: 'module',
    description: 'Manage the modules in this server.',
    options: [
      // /modules enable <module>
      {
        name: 'enable',
        description: 'Enable module.',
        type: 1,
        options: [
          {
            name: 'module',
            description: 'The module to enable.',
            type: ApplicationCommandOptionType.String,
            choices,
            required: true,
          },
        ],
      },

      // /modules disable <module>
      {
        name: 'disable',
        description: 'Disable module.',
        type: 1,
        options: [
          {
            name: 'module',
            description: 'The module to disable.',
            type: ApplicationCommandOptionType.String,
            choices,
            required: true,
          },
        ],
      },
    ],
  },

  guildOnly: true,
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
