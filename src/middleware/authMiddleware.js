const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authentication = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { _id } = decode;
    const user = await User.findOne({ _id, "tokens.token": token });

    if (!user) throw new Error();

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please Authenticate" });
  }
};

module.exports = authentication;
