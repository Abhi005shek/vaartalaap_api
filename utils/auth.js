const jwt = require("jsonwebtoken");

const SECRET_KEY = "vartalaap-secret-key";

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.query.token;

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error: Invalid token"));
    }

    socket.user = decoded;
    next();
  });
};

module.exports = authenticateSocket;
