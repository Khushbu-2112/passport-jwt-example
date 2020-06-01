const crypto = require('crypto'); // module available by default no need to install
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname,'..','id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey,'utf8');

function generatePassword(password){
    let salt = crypto.randomBytes(32).toString('hex');
    let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return {salt, hash};
}

// in this functions value 1000 is iteration count it should be min 1000. as max as secure. 64 is key length

function validatePassword(password, hash, salt){
    let hashVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

function issueJWT(user){
    const _id = user._id;
    const expiresIn = '1d';
    const uname = user.username;
    const payload = {
      sub: _id,
      username: uname,
      iat: Date.now()
    };
    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  }
}

module.exports.generatePassword = generatePassword;
module.exports.validatePassword = validatePassword;
module.exports.issueJWT = issueJWT;