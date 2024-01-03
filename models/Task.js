const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required."]
  },
  author: {
    type: String,
    required: [true, "Author is required."]
  },
  task: {
    type: String,
    required: [true, "Task is required."]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });


module.exports = mongoose.model('Task', taskSchema);
