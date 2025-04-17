const userModel = require('../models/user');
const passport = require('passport');
const strategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const id = "56084611208-28517a6fmnq2jm4fgs7r7q1mjogtgloq.apps.googleusercontent.com";
const secret = "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";

passport.use(
    new strategy({
        clientID: id,
        clientSecret: secret,
        callbackURL: "http://localhost:3000/auth/google/callback"
        
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userModel.findOne({ email: profile.emails[0].value });
                if (!user) {
                    return done(null, false, { mesg: "not" });
                }
                if (!user.googleId) {
                    user.googleId = profile.id; 
                     
                }
                token = jwt.sign({ ID: user.id }, 'aijhle');
                await user.save();
                return done(null, { user, token });
            }
            catch (error) {
                return done(error, null);
            
        
            }
        }
    )
)
passport.serializeUser((usertoken, done) =>
{
    done(null, usertoken.user.id);
}
);
passport.deserializeUser(async (id, done) =>
{
    try
    {
        const user = await userModel.findById(id);
        // if (!user)
        // {
        //     return done(new Error("user not found"), null);
        // }
        done(null, user);
    }
    catch (error)
    {
        done(error, null);
    }
})