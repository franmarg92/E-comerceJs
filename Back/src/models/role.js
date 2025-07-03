const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    }
  },
  { timestamps: true }
);

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
