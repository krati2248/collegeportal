const mongoose = require('mongoose');
const Local_url = "mongodb://127.0.0.1:27017/collegeportal";
const liveurl="mongodb+srv://Kratika_Shrivastava:ram123@cluster0.ttf0trt.mongodb.net/collegeportal?retryWrites=true&w=majority&appName=Cluster0"
const connectDB = async () =>
{
    try
    {
        await mongoose.connect(liveurl);
        console.log('mongodb connected');
    }
    catch (error)
    {
        console.log("error occured",error);
    }
}
module.exports = connectDB;