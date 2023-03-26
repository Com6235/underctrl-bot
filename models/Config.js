const { Schema, model } = require('mongoose');

const configSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  value: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

module.exports = model('Config', configSchema);
