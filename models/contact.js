const mongoose = require('mongoose')

const ContactSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    },
    message:{
        type:String,
        require:true
    },

   


},{timestamps:true})
const ContactModel = mongoose.model('contact',ContactSchema)
module.exports =ContactModel