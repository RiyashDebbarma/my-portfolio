const mongoose = require('mongoose');

// This defines the shape of a project in the database
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true
    },
    tags: {
      type: [String],  // array of strings e.g. ["Node.js", "MongoDB"]
      default: []
    },
    liveUrl: {
      type: String,
      default: ''
    },
    githubUrl: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true  // automatically adds createdAt and updatedAt fields
  }
);

// 'Project' becomes the 'projects' collection in MongoDB
module.exports = mongoose.model('project', projectSchema);