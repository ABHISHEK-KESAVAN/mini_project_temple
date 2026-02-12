const mongoose = require('mongoose');

// Atomic counter per day to generate sequential token numbers and enforce daily max.
const tokenCounterSchema = new mongoose.Schema(
  {
    dateKey: { type: String, required: true, unique: true }, // e.g. "20260203"
    seq: { type: Number, required: true, default: 0 }, // last issued sequence for the day
  },
  { timestamps: true }
);

module.exports = mongoose.model('TokenCounter', tokenCounterSchema);


