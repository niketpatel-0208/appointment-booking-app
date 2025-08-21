// api/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ error: { code: 'NO_TOKEN', message: 'No token, authorization denied.' } });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ error: { code: 'TOKEN_INVALID', message: 'Token is not valid.' } });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Access denied. Admin role required.' } });
    }
};

module.exports = { protect, isAdmin };
