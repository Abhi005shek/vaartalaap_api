const jwt = require("jsonwebtoken");

const SECRET_KEY = "vartalaap-secret-key";

const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  const bearerToken = token.split(" ")[1];
  if (!bearerToken) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(bearerToken, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
