var mongoose = require("mongoose");

var schemaStudent = new mongoose.Schema({
    Name: String,
    Age: Number,
    Class: String,
    Date: String,
    Image: String,
});

module.exports = mongoose.model("Student", schemaStudent);