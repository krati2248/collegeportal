const courseModel = require('../../models/course');
const nodemailer = require('nodemailer');
class adminController
{
    static courseDisplay = async (req, res) =>
    {
        try
        {
            const { id, name, image } = req.Udata;
            const course = await courseModel.find();
            res.render('admin/display', { n: name, i: image, c: course, j: 0, mesg:req.flash('success'), role:1});
        }
        catch (error)
        {
            console.log(error);
        }
    }
    static courseview = async (req, res) =>
    {
        try
        {
            const { name, image } = req.Udata;
            const id = req.params.id;
            const course = await courseModel.findById(id);
            console.log(course);
            res.render('admin/view', { n: name, i: image, c: course, role: 1 });
        }
        catch (error)
        {
            console.log(error);
        }
    }
    static adcourse_edit =async(req, res) =>
    {
        try {
            const { name, image } = req.Udata;
            const id = req.params.id;
            const course = await courseModel.findById(id);
            res.render('admin/edit', { n: name, i: image, c: course, role: 1 });
        }
        catch (error)
        {

        }
    }
    static adcourse_updat = async (req, res) =>
    {
        try
        {
            const { name, email, gender, phone, dob, education, course } = req.body;
            const id = req.params.id;
            const courseupdat = await courseModel.findByIdAndUpdate(id,
                {
                    name,
                    email,
                    gender,
                    phone,
                    dob,
                    education,
                    course
                }

            )
            req.flash('success', 'course updated');
            return res.redirect('/admin/courseDisplay');
        }
        catch (error)
        {
            console.log(error);
        }
    }
    static updateStatus = async (req, res) => {
        try {
            const id = req.params.id;
            const { name, email, course, status, comment } = req.body
            await courseModel.findByIdAndUpdate(id, {
                status,
                comment
            })
            if (status == "Reject") {
                this.RejectEmail(name, email, course, status, comment)
            } else {
                this.ApprovedEmail(name, email, course, status, comment)
            }
            return res.redirect('/admin/courseDisplay')
        } catch (error) {
            console.log(error)
        }

    }
    static adcourse_delete = async (req, res) => {
        try {
            //console.log(req.params.id);
                 
            const id = req.params.id;
            const course = await courseModel.findByIdAndDelete(id);
            //console.log(course);
            req.flash('success', 'course deleted successfully');
            return res.redirect('/admin/courseDisplay');
        } catch (error) {
            console.log(error)
        }
    }
    static RejectEmail = async (name, email,course,status,comment) => {
        //console.log(name,email,course)
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
            from: "kratikashrivastava200@gmail.com", // sender address
            to: email, // list of receivers
            subject: ` Course ${course} Reject`, // Subject line
            text: "heelo", // plain text body
            html: `<head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border: 1px solid #dddddd;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    text-align: center;
                }
                .email-body {
                    font-size: 16px;
                    color: #333333;
                    margin-bottom: 20px;
                }
                .email-footer {
                    font-size: 14px;
                    color: #777777;
                    text-align: center;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">Message Registered Successfully</div>
                <div class="email-body">
                    <p>Dear <b>${name}</b>,</p>
                     
                    <p>Unfortunately, your course has been rejected. Please review the feedback below for further details:<br>
                   ${comment}</p>
                    <p>We appreciate your effort and encourage you to reach out if you have any questions or need clarification.</p>
                </div>
                <div class="email-footer">
                    Thank you,<br>
                    The Support Team
                </div>
            </div>
        </body>
             `, // html body
        });
    };
    static ApprovedEmail = async (name, email,course,status,comment) => {
        console.log(name,email,course)
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
            subject: ` Course ${course} Approved`, // Subject line
            text: "heelo", // plain text body
            html: `<head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border: 1px solid #dddddd;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    text-align: center;
                }
                .email-body {
                    font-size: 16px;
                    color: #333333;
                    margin-bottom: 20px;
                }
                .email-footer {
                    font-size: 14px;
                    color: #777777;
                    text-align: center;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">Message Registered Successfully</div>
                <div class="email-body">
                    <p>Dear <b>${name}</b>,</p>
                   <p>We are pleased to inform you that your course has been approved! Congratulations on your hard work and dedication.<br>
                   ${comment}<p>
                    <p>We appreciate your effort and encourage you to reach out if you have any questions or need clarification.</p>
                </div>
                <div class="email-footer">
                    Thank you,<br>
                    The Support Team
                </div>
            </div>
        </body>
             `, // html body
        });
      };
}
module.exports = adminController;