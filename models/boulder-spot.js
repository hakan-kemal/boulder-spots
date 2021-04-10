const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoulderSpot = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('spots', BoulderSpot);
