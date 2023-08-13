const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    unique: true,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  hobbies: {
    type: String,
    required: false,
  },
});

const Form = mongoose.models.forms || mongoose.model('forms', formSchema);

module.exports = Form;