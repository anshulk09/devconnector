const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/User');

// router.get('/', (req, res) => {
//   res.send('Auth route');
// });

// @route  Get api/auth
// @desc   get token
// @access Protected
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('server error');
  }
});
module.exports = router;
