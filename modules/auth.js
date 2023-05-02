
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Hash password before saving to database
const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};


const hashPassword = async (password) => {
    // salt = 10 is recommended by bcrypt
    return await bcrypt.hash(password, 10);
};


const createJWT = (user) => {
    const token = jwt.sign({ id: user.email, username: user.password },
        process.env.JWT_SECRET || "secret",
        { expiresIn: '6h', algorithm: 'HS256' },
    );
    return token;
};

// Middleware to protect routes
const protect = (req, res, next) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = bearer.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Not a valid token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.user = decoded;
        next()
    } catch (error) {
        return res.status(401).json({ message: "Not a valid token" });
    }
}

module.exports = {
    comparePassword,
    hashPassword,
    createJWT,
    protect
};