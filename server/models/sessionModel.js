const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: function () {
      return this.status === 'published';
    },
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    jsonUrl: {
      type: String,
    //   required: [true, 'JSON file URL is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

module.exports = mongoose.model('Session', sessionSchema);
