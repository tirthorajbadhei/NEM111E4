require("dotenv").config();
const mongoose = require("mongoose");

const connect = mongoose.connect(process.env.database);

module.exports = { connect };
