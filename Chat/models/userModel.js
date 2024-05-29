const mongoose = require("mongoose")

const collection = "Users"

const userSchema = mongoose.Schema({
    name: String,
    color: String
})

module.exports = mongoose.model(collection, userSchema)