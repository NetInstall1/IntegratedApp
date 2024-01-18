const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    console.log(`generate token ${id}`)
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

module.exports = generateToken;
