const contactModel = require('../models/contact')
const nodemailer = require('nodemailer');
class ContactController
{
    static ContactInsert = async (req, res) =>
    {
        try
        {
            //console.log(req.body);
             
            const { name, email, message, phone } = req.body;
            const conta = await contactModel.create({
                name,
                email,
                phone,
                message,
                
            })
            this.func(name, email, phone, message);
            req.flash('success', 'message sent');
            return res.redirect('/contact');
        }
        catch (error)
        {
            console.log(error);
        }
    }
    static func = async (name, email, phone, message) =>
    {
        let transporter = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth:
            {
                user: "kratikashrivastava200@gmail.com",
                pass:"mdft dxjx amkt febh"
            }
        })
        let i = await transporter.sendMail({
            from:email,
            to: "kratikashrivastava200@gmail.com",
             
            subject: `regarding course`, // Subject line
            text: "Hello", // plain text body
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
                 
                <div class="email-body">
                     
                    <p>${message}</p>
                     
                </div>
                <div class="email-footer">
                    Thank you,<br>
                    
                </div>
            </div>
        </body>`
        })
    }
    static contact= async (req, res) =>
    {
        try
        {
            const { name, image } = req.Udata;
            res.render('contact', {n:name,i:image,j:1, mesg: req.flash('success'), role:0 });
        }
        catch (error)
        {
            console.log(error);
        }
    }
}
module.exports = ContactController;