const jwt = require('jsonwebtoken');
const config = require('config');

//next is a call back we have to run once we are done with auth so that it can moc=ve to the next piece of middleware
module.exports = function (req, res, next) {
  // Get toke from header
  const token = req.header('x-auth-token');

  //Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  //verify  token
  try {
    const decoded = jwt.verify(token, config.get('jwtsecret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
