const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password:
    {
        type: String,
        require:true
    },
    role:
    {
        type: String,
        default:'student'
    },
    image:{
        public_id: {
            type:String,
            require:true
        },
        url: {
            type:String,
            require:true
        },
    },
    token:
    {
        type: String
    },
    googleId:
    {
        type: String,
        unique: true,
        sparse:true
    }
})
const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;