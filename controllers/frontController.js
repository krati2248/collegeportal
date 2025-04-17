const UserModel = require('../models/user')
const TeacherModel = require('../models/techer');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary');
const jwt = require("jsonwebtoken");
const CourseModel = require('../models/course');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
cloudinary.config({
  cloud_name: 'dxatdsvqw',
  api_key: '473922139247129',
  api_secret: 'SK_AVgvTrcLgnj_JjUyGedsKsgo' // Click 'View API Keys' above to copy your API secret
});
class frontController {
  static login = async (req, res) => {
    try {
      res.render("login", { msg: req.flash('success'), message: req.flash('error') });
    }
    catch (error) {
      console.log(error);
    }
  }
  static register = async (req, res) => {
    try {
      res.render("register", { message: req.flash('error') });
    }
    catch (error) {
      console.log(error);
    }
  }
  static home = async (req, res) => {
    try {
      //console.log("hello");
      //console.log("home controller hit:", req.method, req.url);
      if (!req.Udata) throw new Error("req.Udata is undefined");

      const { name, image, email, id } = req.Udata;
      const btech = await CourseModel.findOne({ user_id: id, course: 'btech' });
      //console.log(btech);
      const bca = await CourseModel.findOne({ user_id: id, course: 'BCA' });
      const bsc = await CourseModel.findOne({ user_id: id, course: 'BSC' });
      const bcom = await CourseModel.findOne({ user_id: id, course: 'BCOM' });
      const bba = await CourseModel.findOne({ user_id: id, course: 'BBA' });
      const be = await CourseModel.findOne({ user_id: id, course: 'BE' });
      //console.log("hello");
      return res.render("home", { n: name, i: image, e: email, btech: btech, bsc: bsc, bca: bca, bcom: bcom, bba: bba, be: be, role: 0 });
    }
    catch (error) {
      console.log("controller error:", error);
      //console.log(error);
    }
  }
  static about = async (req, res) => {
    try {
      const { name, image } = req.Udata;
      res.render("about", { n: name, i: image, role: 0});

    }
    catch (error) {
      console.log(error);
    }
  }


  static studentInsert = async (req, res) => {
    try {
      const { name, email, password, confirmpassword } = req.body;
      if (!name || !email || !password || !confirmpassword) {
        req.flash('error', "all fields are required");
        return res.redirect('/register');
      }
      const user = await UserModel.findOne({ email: email });
      //console.log("hello");
      if (user) {
        req.flash("error", "email already exist");
        return res.redirect('/register');
      }
      if (password != confirmpassword) {
        req.flash("error", "password does not match");
        return res.redirect('/register');
      }
      //console.log(req.files);
      const file = req.files.image;
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "profile"
      })
      //console.log(imageUpload);
      const hashpassword = await bcrypt.hash(password, 10);

      const data = await UserModel.create({
        name,
        email,
        password: hashpassword,
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url
        }
      })
      req.flash("success", "Register successfully please login here");
      return res.redirect("/");

    }
    catch (error) {
      console.log("Hello");
      console.log(error);
    }

  }
  static verifyLogin = async (req, res) => {
    try {
      //console.log(req.body);
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        req.flash("error", "you are not registered");
        return res.redirect('/');
      }
      else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          if (user.role == 'student') {
            var token = jwt.sign({ ID: user.id }, 'aijhle');
            console.log(token);
            res.cookie('token', token);
            return res.redirect('/home');
          }
          if (user.role == 'admin') {
            var token = jwt.sign({ ID: user.id }, 'aijhle');
            console.log(token);
            res.cookie('token', token);
            return res.redirect('/admin/courseDisplay');
          }
        }
        else {
          req.flash("error", "Email or Password not match");
          return res.redirect('/');
        }
      }
    }
    catch (error) {
      console.log("error h");
      console.log(error);
    }
  }
  static logout = async (req, res) => {
    try {
      res.clearCookie('token');
      return res.redirect('/');

    }
    catch (error) {
      console.log(error);
    }
  }
  static profile = async (req, res) => {
    try {
      const { name, image, email, id } = req.Udata;
      const user = await UserModel.findOne({ email: email });
      if (user.role == 'student')
      {
        res.render('profile', { n: name, i: image, e: email, role: 0 });
      }
      else
      {
        res.render('profile', { n: name, i: image, e: email, role: 1 });
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  static changePassword = async (req, res) => {
    try {
      const { id } = req.Udata
      // console.log(req.body);
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        //console.log(isMatched)
        if (!isMatched) {
          req.flash("error", "Current password is incorrect ");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "Password does not match");
            res.redirect("/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "Password Updated successfully ");
            res.redirect("/");
          }
        }
      } else {
        req.flash("error", "ALL fields are required ");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }

  };
  static updateProfile = async (req, res) => {
    try {
      const { id } = req.Udata;
      const { name, email } = req.body;
      if (req.files) {
        const user = await UserModel.findById(id);
        const imageID = user.image.public_id;
        // console.log(imageID);

        //deleting image from Cloudinary
        await cloudinary.uploader.destroy(imageID);
        //new image update
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "userprofile",
          }
        );
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await UserModel.findByIdAndUpdate(id, data);
      req.flash("success", "Update Profile successfully");
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  };
  static forgetPasswordVerify = async (req, res) => {
    try {
      const { email } = req.body;
      const userData = await UserModel.findOne({ email: email });
      //console.log(userData)
      if (userData) {
        const randomString = randomstring.generate();
        await UserModel.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        this.sendEmail(userData.name, userData.email, randomString);
        req.flash("success", "Plz Check Your mail to reset Your Password!");
        res.redirect("/");
      } else {
        req.flash("error", "You are not a registered Email");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static sendEmail = async (name, email, token) => {
    // console.log(name,email,status,comment)
    // connenct with the smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "kratikashrivastava200@gmail.com",
        pass: "mdft dxjx amkt febh",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      text: "heelo", // plain text body
      html: "<p>Hii " +
        name +
        ',Please click here to <a href="https://collegeportal-dlu7.onrender.com/reset-password?token=' +
        token +
        '">Reset</a>Your Password.',

    });
  };
  static reset_Password = async (req, res) => {
    try {
      const token = req.query.token;
      const tokenData = await UserModel.findOne({ token: token });
      console.log(tokenData);
      if (tokenData) {
        res.render("reset-password", { user_id: tokenData._id });
      } else {
        res.render("404");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static reset_Password1 = async (req, res) => {
    try {
      const { password, user_id } = req.body;
      const newHashPassword = await bcrypt.hash(password, 10);
      await UserModel.findByIdAndUpdate(user_id, {
        password: newHashPassword,
        token: "",
      });
      req.flash("success", "Reset Password Updated successfully ");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
  static gl = async (req, res) => {
    try {
      res.cookie('token', req.user.token);
      res.redirect("/home");
    }
    catch (error) {
      console.log(error);
    }
  }
}
module.exports = frontController;