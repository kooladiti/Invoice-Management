const jwt = require("jsonwebtoken");

const SECRET_KEY = "softech@123";

function generateToken(payload, expiresIn = "7d") {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY);
}

module.exports = { generateToken, verifyToken };
