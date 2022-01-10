const {Schema, model} = require("mongoose")

const User = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    username: {type: String, default: 'Unknow user'},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    diskSpace: {type: Number, default: 1024**3/4/2},
    usedSpace: {type: Number, default: 0},
    avatar: {type: String},
    registrationDate: {type: Date, default: Date.now()},
    files : [{type: Schema.Types.ObjectId, ref:'File'}]
})

module.exports = model('User', User)