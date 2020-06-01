const JwtStrategy = require('passport-jwt').Strategy;
const extraxtJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const path = require('path');
const User = require('mongoose').model('User');
const pasthToKey = path.join(__dirname,'..','id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pasthToKey,'utf8');

const options = {
    jwtFromRequest: extraxtJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms:['RS256']
};

module.exports = (passport) => {
    passport.use( new JwtStrategy(options, function(jwt_payload,done){
        console.log(jwt_payload);
        User.findOne({_id:jwt_payload.sub}, (err,user)=> {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
}