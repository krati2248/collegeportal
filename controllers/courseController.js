const CourseModel = require('../models/course');
class courseController {
    static courseInsert = async (req, res) => {
        try {
            //console.log(req.body);
            const { id } = req.Udata;
            const { name, email, phone, dob, address, gender, education, course } = req.body
            const resu = await CourseModel.create({
                name,
                email,
                phone,
                dob,
                address,
                gender,
                education,
                course,
                user_id: id
            });

            res.redirect('/courseDisplay')
        }
        catch (error) {
            console.log(error);
        }
    }
    static courseDisplay = async (req, res) => {
        try {
            const { name, image, id } = req.Udata;
            const course = await CourseModel.find({ user_id: id })
            res.render('course/display', { n: name, i: image, c: course, j:0, mesg: req.flash('success'), megs:req.flash('success'), role:0})
        } catch (error) {
            console.log(error)
        }
    }
    static courseView=async (req, res) => {
        try {
            //console.log(req.params.id);
            const { name, image } = req.Udata;
            const id = req.params.id;
            const course = await CourseModel.findById(id);
            console.log(course);
            res.render('course/view', { n: name, i: image, c: course, j:0, role:0 })
        } catch (error) {
            console.log(error)
        }
    }
    static courseEdit = async (req, res) =>
    {
        try
        {
            const { name, image } = req.Udata;
            const id = req.params.id;
            const course = await CourseModel.findById(id);
            res.render('course/edit',{n:name,i:image,c:course,j:0, role:0});
        }
        catch (error)
        {
            console.log(error);
        }
    }
    static courseDelete=async (req, res) => {
        try {
            //console.log(req.params.id);
             
            const id = req.params.id;
            const course = await CourseModel.findByIdAndDelete(id);
            //console.log(course);
            req.flash('success','course deleted successfully');
            res.redirect('/courseDisplay');
        } catch (error) {
            console.log(error)
        }
    }
    static courseUpdate = async (req, res) =>
        {
            try
            {
                const { name, email, phone, dob, address, gender, education, course } = req.body; 
                const id = req.params.id;
                const courseupdate = await CourseModel.findByIdAndUpdate(id, {
                name,
                email,
                phone,
                dob,
                address,
                gender,
                education,
                course,
                 
                })
                req.flash('success', 'course updated');
                res.redirect('/courseDisplay');
            }
            catch (error)
            {
                console.log(error);
            }
        }
}
module.exports = courseController;