const mongoose = require("mongoose")

const articleSchema = new mongoose.Schema({
    name: String,
    desc: String,
    price: Number,
    color: String,
    image:{
        data: Buffer,
        contentType: String
    }
})

module.exports = new mongoose.model("Product", articleSchema)