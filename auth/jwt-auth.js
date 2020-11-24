const jwt = require('express-jwt');
const auth = require('./auth');

const jwtAuth = jwt(auth.getVerifyOptions());

module.exports = jwtAuth;