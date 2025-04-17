const express = require('express');
const frontController = require('../controllers/frontController');
const route = express.Router();
const checkAuth = require("../middleware/auth");
const courseController = require('../controllers/courseController');
const adminController = require('../controllers/admin/adminController');
const contactController = require('../controllers/contactController');
const adminrole = require('../middleware/adminrole');
const passport = require('passport');
const isLogin = require('../middleware/isLogin');
// route.get('/', (req,res) =>
// {
//     res.send("home");
// })

route.get('/', isLogin, frontController.login);  //path

route.get('/register', frontController.register);
route.get('/home',checkAuth, frontController.home);
route.get('/about',checkAuth, frontController.about);
//route.get('/contact',checkAuth, contactController.contact);
route.get('/logout', frontController.logout);
//insert data
route.post('/insertStudent', frontController.studentInsert);
route.post('/verifyLogin', frontController.verifyLogin);

//course controller
route.get('/courseDisplay',checkAuth, courseController.courseDisplay);
route.get('/courseView/:id', checkAuth, courseController.courseView);
route.get('/courseDelete/:id',checkAuth, courseController.courseDelete);
//insert
route.post('/course_insert', checkAuth, courseController.courseInsert);
route.get('/courseEdit/:id', checkAuth, courseController.courseEdit); 
route.post('/course_Update/:id', checkAuth, courseController.courseUpdate);
route.get('/admin/courseEdit/:id', checkAuth, adminController.adcourse_edit);
route.post('/admin/adcourse_updat/:id', checkAuth, adminController.adcourse_updat);
route.get('/profile', checkAuth, frontController.profile);
route.post('/changePassword', checkAuth, frontController.changePassword);
route.post('/updateProfile', checkAuth, frontController.updateProfile);

//admin controller
route.get('/admin/courseDisplay', checkAuth, adminrole('admin'), adminController.courseDisplay);
route.post('/admin/update_status/:id', checkAuth, adminrole('admin'), adminController.updateStatus);
route.get('/admin/courseView/:id', checkAuth, adminController.courseview);
route.get('/admin/courseDelete/:id', checkAuth, adminController.adcourse_delete);
//forgot password
route.post('/forgot_Password', frontController.forgetPasswordVerify);
route.get('/reset-password', frontController.reset_Password);
route.post('/reset_Password1', frontController.reset_Password1);

route.post('/insertContact', checkAuth, contactController.ContactInsert);
route.get('/contact', checkAuth, contactController.contact);
route.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
route.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: '/login?error=google-login-failed' }),frontController.gl);
module.exports = route;