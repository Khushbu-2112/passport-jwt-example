var express = require('express');
var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const utils = require('../lib/passportUtils');

router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
    // res.render('dashboard', {data: 'user'});
});

// Validate an existing user and issue a JWT
router.post('/login', function(req, res, next){

    User.findOne({ username: req.body.username })
        .then((user) => {

            if (!user) {
                res.status(401).json({ success: false, msg: "could not find user" });
                // res.render('login', {msg: "could not find user"});
            }
            
            // Function defined at bottom of app.js
            const isValid = utils.validatePassword(req.body.password, user.hash, user.salt);
            
            if (isValid) {

                const tokenObject = utils.issueJWT(user);
                const uname = req.body.username;
                res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires });
                // res.redirect('/protected');
                // res.render('dashboard',  {token: tokenObject.token, username: uname });

            } else {

                res.status(401).json({ success: false, msg: "you entered the wrong password" });
                // res.render('login',{msg: "you entered the wrong password" });
            }

        })
        .catch((err) => {
            next(err);
        });
});

// Register a new user
router.post('/register', function(req, res, next){
    const saltHash = utils.generatePassword(req.body.password);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt
    });

    try {
        newUser.save()
            .then((user) => {
                res.json({ success: true, user: user });
                // res.render('login',{msg:'Registered..!!'});
            });

    } catch (err) {
        res.json({ success: false, msg: err });
    }

});

module.exports = router;