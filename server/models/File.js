const { Schema, model } = require('mongoose')

const File = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    accessLink: {type: Boolean, default: false},
    accessLoginLink: {type: Boolean, default: false},
    urlLink: {type: String},
    code: {type: String, unique: true},
    clicks: {type: Number, default: 0},
    clicksDate: {type: Array},
    downloads: {type: Number, default: 0},
    size: {type: Number, default: 0},
    path: {type: String, default: ''},
    date: {type: Date, default: Date.now()},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    parent: {type: Schema.Types.ObjectId, ref: 'File'},
    childs: [{type: Schema.Types.ObjectId, ref: 'File'}]
})

module.exports = model('File', File)