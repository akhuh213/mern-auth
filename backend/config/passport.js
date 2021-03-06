require('dotenv').config();

// A passport strategy for authenticating with a JSON web Token
// This allows to authenticate endpoints using the token. 
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const passport = require('passport')
const User = mongoose.model('User');
// const db = require('../models')
// options is an object literl containing options to control
// how the toekn is extracted from the request or verified
const options = {}
// jwtFromRequest (REQUIRED) functin that accepts a request as the
// only parameter and returns either the JWT as a string or null.
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.JWT_SECRET;


// fromAuthHeaderAsBearerToken(); creates an extractor that looks for the JWT in the auth header
module.exports = (passport) => {
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
        // jwt_payload is an object literal containing the decoded JWT payload
        // done is a passport callback that has error first as an argument done(error, user, info)
        .then(user => {
            if (user) {
                // If the user is found, return null (for error) and user
                return done(null, user);
            }
            // If no user is found
            return done(null, false);
        })
        .catch(error => console.log(error));
    }))
}


