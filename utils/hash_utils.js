const bcrypt = require("bcrypt");

exports.generateSaltedPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

exports.comparePasswords = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
