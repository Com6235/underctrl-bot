const { Schema, model } = require('mongoose');

const guildConfigSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    adminRoles: [String],
    modRoles: [String],
    helperRoles: [String],

    modules: {
      type: [
        new Schema({
          name: {
            type: String,
            required: true,
          },
          enabled: {
            type: Boolean,
            required: true,
          },
        }),
      ],
      default: [],
    },

    helpForums: [
      new Schema({
        id: { type: String, required: true },
        solvedTagId: String,
      }),
    ],

    suggestionChannels: [
      new Schema({
        id: { type: String, required: true },
        embedColor: Number,
        upvoteReaction: String,
        downvoteReaction: String,
      }),
    ],

    faqForum: [
      new Schema({
        id: { type: String, required: true },
        indexId: String,
      }),
    ],
  },
  { timestamps: true }
);

module.exports = model('GuildConfig', guildConfigSchema);
