const jwt = require("jsonwebtoken");
const UserModel = require('../models/user');
//security
const checkAuth = async(req, res, next) =>
{
    //console.log("Auth");
    const { token } = req.cookies;
    //console.log(token);
    if (!token) {
        req.flash('error', 'Unauthorised user please login')
        res.redirect('/')
    } else {
        const verifyToken = jwt.verify(token, 'aijhle');
        //console.log(verifyToken);
        const data = await UserModel.findOne({ _id: verifyToken.ID });
        //console.log(data);
        //console.log("Hello");
         
        req.Udata = data;
        next(); //it will redirect to the route
    }
}
module.exports = checkAuth;