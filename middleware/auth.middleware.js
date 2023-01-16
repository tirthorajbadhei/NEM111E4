const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const decode = jwt.verify(token, "suvo");
    if (decode) {
      next();
    } else {
      res.send("not authorized to view this page");
    }
  } else {
    res.send("not authorized to view this page");
  }
};

module.exports = { auth };
