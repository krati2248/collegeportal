const jwt = require('jsonwebtoken')
const UserModel = require('../models/user')

const isLogin = async (req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        verifyLogin = jwt.decode(token);
        const data = await UserModel.findOne({ _id: verifyLogin.ID })
        // console.log(verifyLogin.payload);
        // const Data = await UserModel.findOne({ token: token });
        // console.log(data)
        if (data.role == 'student') {
            res.redirect('/home')
        }
        else if (data.role == 'admin') {
            res.redirect('/admin/courseDisplay')
        }
        next()
    }
    else {
        next();
    }

}
module.exports = isLogin