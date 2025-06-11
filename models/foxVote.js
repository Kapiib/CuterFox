const mongoose = require('mongoose');

const foxVoteSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
    unique: true
  },
  votes: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true // This adds both createdAt and updatedAt automatically
});

module.exports = mongoose.model('FoxVote', foxVoteSchema);