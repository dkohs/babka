const mongoose = require('mongoose');

const connection = mongoose.connect('mongodb://localhost:27017/babka-db')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

module.exports = {connection}