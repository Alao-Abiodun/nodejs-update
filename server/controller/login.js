const User = require('../model/User');
const bcrypt = require('bcryptjs');
// const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY
/**
 * This function trim a new url that hasn't been trimmed before
 * @param {object} req
 * @param {object} res
 * @returns {object} response object with trimmed url
 */
exports.login = (req, res) => {
  const {
    email,
    password
  } = req.body;
  User.findOne({
      email
    })
    .then(user => {
      if (!user) {
        errors.email = "No Account Found";
        return res.status(404).json(errors);
      }
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              id: user._id,
              name: user.username
            };
            jwt.sign(payload, SECRET_KEY, {
                expiresIn: 36000
              },
              (err, token) => {
                if (err) res.status(500)
                  .json({
                    error: "Error signing token",
                    raw: err
                  });
                res.json({
                  success: true,
                  token: `Bearer ${token}`
                });
              });
          } else {
            errors.password = "Password is incorrect";
            res.status(400).json(errors);
          }
        });
    });
};